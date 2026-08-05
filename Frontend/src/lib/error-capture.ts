// Captures the original Error out-of-band in both Node.js process and browser runtime
// so server.ts can recover the true stack trace when h3 has swallowed a throw into HTTPError.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 10_000;

export function recordCapturedError(error: unknown) {
  if (!error) return;
  console.error("[CRITICAL_SSR_ERROR_CAPTURED]:", error);
  if (error instanceof Error && error.stack) {
    console.error("[CRITICAL_SSR_STACK_TRACE]:\n", error.stack);
  }
  lastCapturedError = { error, at: Date.now() };
}

if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("uncaughtException", (err) => recordCapturedError(err));
  process.on("unhandledRejection", (reason) => recordCapturedError(reason));
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => recordCapturedError((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    recordCapturedError((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
