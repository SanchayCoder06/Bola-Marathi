import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Patch globalThis.fetch on the server side to log EVERY fetch request during SSR
if (typeof globalThis.fetch === "function" && !(globalThis.fetch as any).__isPatched) {
  const originalFetch = globalThis.fetch;
  const patchedFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const method = (init?.method || (typeof input === "object" && "method" in input ? (input as any).method : "GET")).toUpperCase();

    console.log(`[SSR-Fetch] 🚀 ${method} ${url}`);
    try {
      const res = await originalFetch(input, init);
      if (res.status >= 400) {
        const clone = res.clone();
        const bodyText = await clone.text().catch(() => "");
        console.error(`[SSR-Fetch] ❌ ${method} ${url} -> ${res.status}\n[Response Body]:\n${bodyText}`);
      } else {
        console.log(`[SSR-Fetch] ✅ ${method} ${url} -> ${res.status}`);
      }
      return res;
    } catch (err: any) {
      console.error(`[SSR-Fetch] 💥 ${method} ${url} -> EXCEPTION: ${err.message}\n${err.stack}`);
      throw err;
    }
  };
  (patchedFetch as any).__isPatched = true;
  globalThis.fetch = patchedFetch;
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

const isDev = process.env.NODE_ENV !== "production";

async function normalizeCatastrophicSsrResponse(request: Request, response: Response): Promise<Response> {
  if (response.status < 500) return response;

  const url = request.url;
  const method = request.method;

  const bodyText = await response.clone().text().catch(() => "");
  const capturedErr = consumeLastCapturedError();

  const finalError = capturedErr || new Error(`SSR 500 Exception on ${method} ${url}\nResponse Body:\n${bodyText}`);

  console.error(`[SSR 500 Pipeline Error] ${method} ${url} -> 500`);
  console.error(`[SSR Original Error]:`, finalError);
  if (finalError instanceof Error && finalError.stack) {
    console.error(`[SSR Full Stack Trace]:\n${finalError.stack}`);
  }

  return new Response(renderErrorPage(finalError, isDev), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(request, response);
    } catch (error: any) {
      console.error(`[SSR Fatal Exception] ${request.method} ${request.url}:`, error);
      if (error && error.stack) {
        console.error(`[SSR Fatal Stack Trace]:\n${error.stack}`);
      }
      return new Response(renderErrorPage(error, isDev), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
