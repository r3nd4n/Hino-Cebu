import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";

import { stopProcess, trackProcess, waitFor } from "./support/browser-services.mjs";

class FakeProcess extends EventEmitter {
  constructor({ closesAfterKill = true } = {}) {
    super();
    this.closesAfterKill = closesAfterKill;
    this.exitCode = null;
    this.pid = 12345;
    this.signals = [];
  }

  kill(signal) {
    this.signals.push(signal);
    if (signal === "SIGKILL" && this.closesAfterKill) {
      setTimeout(() => {
        this.exitCode = 137;
        this.emit("exit", 137, signal);
        this.emit("close", 137, signal);
      }, 20);
    }
    return true;
  }
}

test("forced browser-service termination waits for close before resolving", async () => {
  const processHandle = trackProcess(new FakeProcess());
  const startedAt = Date.now();

  await stopProcess(processHandle, { gracefulTimeoutMs: 5, forcedTimeoutMs: 100 });

  assert.deepEqual(processHandle.signals, ["SIGTERM", "SIGKILL"]);
  assert.ok(Date.now() - startedAt >= 20, "stopProcess must await the delayed close event");
  assert.equal(processHandle.exitCode, 137);
});

test("browser-service teardown reports a process that never closes", async () => {
  const processHandle = trackProcess(new FakeProcess({ closesAfterKill: false }));

  await assert.rejects(
    stopProcess(processHandle, { gracefulTimeoutMs: 5, forcedTimeoutMs: 5 }),
    /did not close after forced termination/,
  );
  assert.deepEqual(processHandle.signals, ["SIGTERM", "SIGKILL"]);
});

test("browser-service readiness fails immediately for signal-only child exit", async () => {
  const processHandle = { exitCode: null, signalCode: "SIGKILL" };
  const startedAt = Date.now();

  await assert.rejects(
    waitFor("http://127.0.0.1:1/not-contacted", "Signal-only fixture", processHandle),
    /exitCode=null, signalCode=SIGKILL/,
  );
  assert.ok(Date.now() - startedAt < 1_000, "signal-only exit must bypass the readiness deadline");
});
