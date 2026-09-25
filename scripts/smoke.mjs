import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const host = "127.0.0.1";
const port = Number(process.env.SMOKE_PORT ?? 4180);
const baseUrl = `http://${host}:${port}`;
const serverEntry = new URL("../.output/server/index.mjs", import.meta.url);

await access(serverEntry);

const server = spawn(process.execPath, [serverEntry.pathname], {
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
server.stdout.on("data", chunk => { output += chunk; });
server.stderr.on("data", chunk => { output += chunk; });

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Production server exited early (${server.exitCode}).\n${output}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/status`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await delay(100);
  }

  throw new Error(`Timed out waiting for ${baseUrl}.\n${output}`);
}

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  return { response, body: await response.text() };
}

try {
  await waitForServer();

  const root = await request("/");
  assert.equal(root.response.status, 200);
  assert.match(root.body, /HTML first\. Fine-grained interaction next\./);
  assert.match(root.body, /Server-rendered; awaiting hydration/);
  assert.match(root.body, /SolidStart server query/);

  const product = await request("/products/anvil");
  assert.equal(product.response.status, 200);
  assert.match(product.body, /Server Anvil/);

  const missingProduct = await request("/products/unknown");
  assert.equal(missingProduct.response.status, 404);
  assert.match(missingProduct.body, /No product named/);

  const staticPage = await request("/static");
  assert.equal(staticPage.response.status, 200);
  assert.match(staticPage.body, /Written to static HTML during build/);

  const streamed = await request("/stream");
  assert.equal(streamed.response.status, 200);
  assert.match(streamed.body, /The deferred server resource arrived/);

  const clientOnly = await request("/client");
  assert.equal(clientOnly.response.status, 200);
  assert.match(clientOnly.body, /Waiting for the browser-only module/);
  assert.doesNotMatch(clientOnly.body, /Browser APIs are safe here/);

  const status = await request("/api/status");
  assert.equal(status.response.status, 200);
  assert.equal(status.response.headers.get("x-hammer-api"), "status");
  assert.deepEqual(JSON.parse(status.body), {
    ok: true,
    fixture: "hammer-solidstart-ssr",
    method: "GET",
    hasSession: false,
  });

  const posted = await request("/api/status", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ forge: "solid" }),
  });
  assert.equal(posted.response.status, 201);
  assert.deepEqual(JSON.parse(posted.body), { ok: true, echo: { forge: "solid" } });

  const apiProduct = await request("/api/products/anvil");
  assert.equal(apiProduct.response.status, 200);
  assert.equal(JSON.parse(apiProduct.body).name, "Server Anvil");

  const missingApiProduct = await request("/api/products/unknown");
  assert.equal(missingApiProduct.response.status, 404);
  assert.deepEqual(JSON.parse(missingApiProduct.body), {
    error: "Product not found",
    id: "unknown",
  });

  const redirected = await request("/redirect", { redirect: "manual" });
  assert.equal(redirected.response.status, 302);
  assert.equal(redirected.response.headers.get("location"), "/?from=redirect");

  const missing = await request("/definitely-missing");
  assert.equal(missing.response.status, 404);
  assert.match(missing.body, /Nothing is forged at this URL/);

  const error = await request("/error");
  assert.equal(error.response.status, 500);
  assert.match(error.body, /Intentional SolidStart SSR render failure/);

  const session = await request("/session");
  assert.equal(session.response.status, 200);
  assert.match(session.body, /Signed HTTP-only cookie session/);
  const actionPath = session.body.match(/<form action="([^"]+)" method="post">/)?.[1]?.replaceAll("&amp;", "&");
  assert.ok(actionPath, "session page should expose a progressive form action URL");

  const actionResult = await request(actionPath, {
    method: "POST",
    redirect: "manual",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: "nickname=Ada",
  });
  assert.equal(actionResult.response.status, 302);
  assert.match(actionResult.response.headers.get("location") ?? "", /\/session\?saved=1$/);
  assert.equal(actionResult.response.headers.get("x-revalidate"), "visitor-session");
  const setCookie = actionResult.response.headers.get("set-cookie") ?? "";
  assert.match(setCookie, /^hammer-solidstart=/);
  assert.match(setCookie, /HttpOnly/i);

  const sessionCookie = setCookie.split(";", 1)[0];
  const updatedSession = await request("/session", { headers: { cookie: sessionCookie } });
  assert.equal(updatedSession.response.status, 200);
  assert.match(updatedSession.body, /Ada/);
  assert.match(updatedSession.body, /Successful writes/);

  console.log("✓ SSR home, hydration marker, and server query");
  console.log("✓ dynamic route and dynamic 404 status");
  console.log("✓ prerender target and streamed server resource");
  console.log("✓ client-only server fallback");
  console.log("✓ GET/POST and dynamic API routes, API 404, and redirect headers");
  console.log("✓ filesystem 404 and SSR error status");
  console.log("✓ progressive action redirect, signed HttpOnly cookie, and session readback");
} finally {
  server.kill("SIGTERM");
}
