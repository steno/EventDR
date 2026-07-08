import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const version =
    process.env.COMMIT_REF ||
    process.env.DEPLOY_ID ||
    process.env.NETLIFY_COMMIT_REF ||
    "dev";

  return NextResponse.json(
    { version },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    },
  );
}
