import { getCookie } from "@solidjs/start/http";
import type { APIEvent } from "@solidjs/start/server";

export function GET({ request }: APIEvent) {
  return Response.json(
    {
      ok: true,
      fixture: "hammer-solidstart-ssr",
      method: request.method,
      hasSession: Boolean(getCookie("hammer-solidstart")),
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-hammer-api": "status",
      },
    },
  );
}

export async function POST({ request }: APIEvent) {
  const payload = await request.json().catch(() => null) as unknown;
  return Response.json({ ok: true, echo: payload }, { status: 201 });
}
