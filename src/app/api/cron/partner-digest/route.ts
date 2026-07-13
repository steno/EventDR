import { NextRequest, NextResponse } from "next/server";
import { isValidLocale, type Locale } from "@/i18n/config";
import {
  buildAllPartnerDigests,
  buildPartnerDigest,
} from "@/lib/partner-digest";

export const dynamic = "force-dynamic";

function checkCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace("Bearer ", "");
  return provided === secret;
}

async function handleDigest(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const localeParam = request.nextUrl.searchParams.get("locale");
  const format = request.nextUrl.searchParams.get("format") ?? "json";

  try {
    if (localeParam) {
      if (!isValidLocale(localeParam)) {
        return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
      }
      const digest = await buildPartnerDigest(localeParam as Locale);

      if (format === "markdown") {
        return new NextResponse(digest.markdown, {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        });
      }
      if (format === "whatsapp") {
        return new NextResponse(digest.whatsapp, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
      return NextResponse.json(digest);
    }

    const digests = await buildAllPartnerDigests();

    if (format === "markdown") {
      const combined = (["en", "es", "fr"] as const)
        .map((loc) => digests[loc].markdown)
        .join("\n\n---\n\n");
      return new NextResponse(combined, {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
    }

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      locales: digests,
    });
  } catch (error) {
    console.error("Partner digest error:", error);
    return NextResponse.json(
      {
        error: "Digest generation failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handleDigest(request);
}

export async function POST(request: NextRequest) {
  return handleDigest(request);
}
