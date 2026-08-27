import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { access, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createRequire } from "node:module";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const routes = [
  "/trucks",
  "/trucks/200-series",
  "/trucks/300-series",
  "/trucks/500-series",
  "/trucks/bus-puv",
  "/parts-service",
  "/contact",
  "/about",
];

let server;
let baseUrl;
let serverOutput = "";
const routeHtml = new Map();
let compiledCss = "";

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(location) : [location];
  }));
  return files.flat();
}

async function requireFreshBuild() {
  const buildId = path.join(projectRoot, ".next", "BUILD_ID");
  try {
    await access(buildId);
  } catch {
    assert.fail("Phase 3 runtime contracts require a fresh production build. Run `npm run build && npm test && npm run lint`.");
  }

  const inputs = [
    path.join(projectRoot, "package.json"),
    fileURLToPath(import.meta.url),
    ...(await listFiles(path.join(projectRoot, "src"))),
  ];
  const [build, ...inputStats] = await Promise.all([stat(buildId), ...inputs.map(stat)]);
  const newestInput = Math.max(...inputStats.map(({ mtimeMs }) => mtimeMs));
  const buildAgeMs = Date.now() - build.mtimeMs;

  assert.ok(
    build.mtimeMs >= newestInput && buildAgeMs < 15 * 60 * 1000,
    "Phase 3 runtime contracts found stale build output. Run `npm run build && npm test && npm run lint` so tests inspect the immediately preceding build.",
  );
}

async function isolatedPort() {
  return new Promise((resolve, reject) => {
    const socket = createServer();
    socket.unref();
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", () => {
      const address = socket.address();
      socket.close(() => resolve(address.port));
    });
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next production server exited before readiness.\n${serverOutput}`);
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return;
      lastError = new Error(`readiness returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Next production server did not become ready: ${lastError?.message ?? "unknown error"}\n${serverOutput}`);
}

async function stopServer() {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

before(async () => {
  await requireFreshBuild();
  const port = await isolatedPort();
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: projectRoot,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });
  await waitForServer(`${baseUrl}/trucks`);

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`, { signal: AbortSignal.timeout(5_000) });
    assert.equal(response.status, 200, `${route} must return 200 from next start`);
    routeHtml.set(route, await response.text());
  }

  const cssPaths = new Set(
    [...routeHtml.values()].flatMap((html) =>
      [...html.matchAll(/<link[^>]+href="([^"]+\.css(?:\?[^"]*)?)"/g)].map((match) => match[1].replaceAll("&amp;", "&")),
    ),
  );
  assert.ok(cssPaths.size > 0, "production routes must reference compiled CSS assets");
  compiledCss = (await Promise.all([...cssPaths].map(async (href) => {
    const response = await fetch(new URL(href, baseUrl), { signal: AbortSignal.timeout(5_000) });
    assert.equal(response.status, 200, `${href} must return compiled CSS`);
    return response.text();
  }))).join("\n");
});

after(stopServer);

test("all Phase 3 production routes retain the shared shell and inquiry reachability", () => {
  for (const [route, html] of routeHtml) {
    assert.match(html, /<header\b/, `${route} must render the shared header`);
    assert.match(html, /<footer\b/, `${route} must render the shared footer`);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route} must render one main landmark`);
    assert.match(html, /href="\/contact(?:\?[^"#]*)?#inquiry"/, `${route} must expose a local inquiry path`);
  }
});

test("production output gates unresolved facts and excludes unsafe public surfaces", () => {
  const output = [...routeHtml.values()].join("\n");

  assert.match(output, /Phone: awaiting confirmation/);
  assert.match(output, /Address: awaiting confirmation/);
  assert.match(output, /Hours: awaiting confirmation/);
  assert.doesNotMatch(output, /\(032\) 346 3322|tel:\+63323463322/i);
  assert.doesNotMatch(output, /8WC6\+Q46|Saint John Paul II Avenue|Monday|8:00 AM|5:00 PM/i);
  assert.doesNotMatch(output, /maps\.google|google\.com\/maps/i);
  assert.doesNotMatch(output, /https:\/\/(?:www\.)?hino\.com\.ph/i);
  assert.doesNotMatch(output, /promotions?/i);
  assert.doesNotMatch(output, /couldn.t send|could not send|inquiry (?:was )?sent|received your inquiry|we (?:will|'ll) follow[- ]?up/i);
});

test("compiled production styles contain valid light-on-dark CTA rules", () => {
  const output = `${[...routeHtml.values()].join("\n")}\n${compiledCss}`;

  assert.doesNotMatch(output, /:global\(/);
  assert.match(compiledCss, /main#main-content \.page-hero__actions \.button--secondary[^{}]*\{[^}]*border-color:var\(--color-paper\)[^}]*color:var\(--color-paper\)/);
  assert.match(compiledCss, /main#main-content \.local-contact-cta__actions \.button--secondary\{[^}]*border-color:var\(--color-paper\)[^}]*color:var\(--color-paper\)/);
});
