import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { buildAllPartnerDigests } from "@/lib/partner-digest";
import { isResendConfigured, sendWeekendNewsletters } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

async function handleNewsletter(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isResendConfigured()) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "email not configured",
    });
  }

  try {
    const digests = await buildAllPartnerDigests();
    const result = await sendWeekendNewsletters(digests);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json(
      {
        error: "Newsletter send failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handleNewsletter(request);
}

export async function POST(request: NextRequest) {
  return handleNewsletter(request);
}
