export function renderErrorPage(err?: unknown, isDev: boolean = true): string {
  const errorMessage = err instanceof Error ? err.message : String(err || "Unknown error occurred");
  const errorStack = err instanceof Error ? err.stack : "";

  if (isDev) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Development Error — BOLA Marathi</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 14px/1.6 system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
      .container { max-width: 56rem; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      .badge { display: inline-block; background: #ef4444; color: #ffffff; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
      h1 { font-size: 1.5rem; margin: 1rem 0 0.5rem; color: #f8fafc; }
      .msg { background: #0f172a; border-left: 4px solid #ef4444; padding: 1rem; border-radius: 0.5rem; color: #fca5a5; font-family: monospace; font-size: 0.9rem; word-break: break-all; margin-bottom: 1rem; }
      pre { background: #020617; border: 1px solid #1e293b; padding: 1.25rem; border-radius: 0.75rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.825rem; color: #cbd5e1; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
      .actions { margin-top: 1.5rem; display: flex; gap: 0.75rem; }
      button, a { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; font-size: 0.875rem; }
      .btn-primary { background: #e11d48; color: #fff; }
      .btn-secondary { background: #334155; color: #f8fafc; }
    </style>
  </head>
  <body>
    <div class="container">
      <span class="badge">Development Error Overlay</span>
      <h1>Server-Side Render Exception</h1>
      <div class="msg">${escapeHtml(errorMessage)}</div>
      ${errorStack ? `<h3>Stack Trace</h3><pre>${escapeHtml(errorStack)}</pre>` : ""}
      <div class="actions">
        <button class="btn-primary" onclick="location.reload()">Reload Page</button>
        <a class="btn-secondary" href="/">Return to Home</a>
      </div>
    </div>
  </body>
</html>`;
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
