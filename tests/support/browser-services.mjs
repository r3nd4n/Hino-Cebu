import { stat } from "node:fs/promises";
import { createServer } from "node:net";

const closePromises = new WeakMap();

export async function exists(location) {
  try {
    await stat(location);
    return true;
  } catch {
    return false;
  }
}

export async function isolatedPort() {
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

export async function waitFor(url, label, processHandle, output = () => "") {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    const exitedByCode = processHandle?.exitCode !== null && processHandle?.exitCode !== undefined;
    const exitedBySignal = processHandle?.signalCode !== null && processHandle?.signalCode !== undefined;
    if (exitedByCode || exitedBySignal) {
      throw new Error(
        `${label} exited before readiness (exitCode=${processHandle.exitCode ?? "null"}, signalCode=${processHandle.signalCode ?? "null"}).\n${output()}`,
      );
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return response;
      lastError = new Error(`readiness returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`${label} did not become ready: ${lastError?.message ?? "unknown error"}\n${output()}`);
}

export function trackProcess(processHandle) {
  if (!closePromises.has(processHandle)) {
    closePromises.set(processHandle, new Promise((resolve) => {
      if (processHandle.exitCode !== null) resolve();
      else processHandle.once("close", resolve);
    }));
  }
  return processHandle;
}

async function settlesWithin(promise, timeoutMs) {
  let timer;
  try {
    return await Promise.race([
      promise.then(() => true),
      new Promise((resolve) => { timer = setTimeout(() => resolve(false), timeoutMs); }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function stopProcess(
  processHandle,
  { gracefulTimeoutMs = 2_000, forcedTimeoutMs = 2_000 } = {},
) {
  if (!processHandle) return;
  trackProcess(processHandle);
  const closed = closePromises.get(processHandle);

  if (processHandle.exitCode === null) processHandle.kill("SIGTERM");
  if (await settlesWithin(closed, gracefulTimeoutMs)) return;

  if (processHandle.exitCode === null) processHandle.kill("SIGKILL");
  if (await settlesWithin(closed, forcedTimeoutMs)) return;

  throw new Error(`Process ${processHandle.pid ?? "unknown"} did not close after forced termination.`);
}

export class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id) return;
      const waiter = this.pending.get(message.id);
      if (!waiter) return;
      this.pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

export async function openPage(chromeDebugUrl) {
  const response = await fetch(`${chromeDebugUrl}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (!response.ok) throw new Error(`Chrome target creation failed: ${response.status}`);
  const target = await response.json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  const cdp = new Cdp(socket);
  await Promise.all([cdp.send("Page.enable"), cdp.send("Runtime.enable")]);
  return { cdp, socket, target };
}

export async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "Browser evaluation failed");
  return result.result.value;
}

export async function pressKey(cdp, key, code = key, { shift = false } = {}) {
  const virtualKeyCode = key === "Enter" ? 13 : key === "Escape" ? 27 : key === "Tab" ? 9 : 0;
  const modifiers = shift ? 8 : 0;
  await cdp.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key, code, modifiers, windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
  if (key === "Enter") {
    await cdp.send("Input.dispatchKeyEvent", { type: "char", key, code, text: "\r", unmodifiedText: "\r", windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
  }
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers, windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
}
