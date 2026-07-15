import { NextRequest, NextResponse } from "next/server";
import { unsubscribeMailbox } from "@/lib/mailbox";

export const dynamic = "force-dynamic";

function page(title: string, message: string, ok: boolean): NextResponse {
  const color = ok ? "#059669" : "#be123c";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · POP Events</title>
</head>
<body style="margin:0;font-family:system-ui,sans-serif;background:#fafafa;color:#111;display:grid;place-items:center;min-height:100vh;padding:24px;">
  <main style="max-width:420px;background:#fff;border-radius:16px;padding:28px 24px;box-shadow:0 10px 40px -24px rgba(0,0,0,.35);">
    <div style="font-size:12px;font-weight:700;letter-spacing:.04em;color:#f97316;">POP Events</div>
    <h1 style="margin:8px 0 10px;font-size:22px;">${title}</h1>
    <p style="margin:0;color:${color};font-size:15px;line-height:1.45;">${message}</p>
    <p style="margin:22px 0 0;"><a href="https://pop-event.com/en" style="color:#111;font-weight:700;">Back to pop-event.com</a></p>
  </main>
</body>
</html>`;
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!token) {
    return page("Missing link", "This unsubscribe link is incomplete.", false);
  }

  const ok = await unsubscribeMailbox(token);
  if (!ok) {
    return page("Already unsubscribed", "This email is not on the list (or the link expired).", true);
  }

  return page("Unsubscribed", "You won’t get weekend event emails anymore.", true);
}
