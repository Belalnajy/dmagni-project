import { NextRequest, NextResponse } from "next/server";
import { performVirtualTryOn } from "@/lib/services/replicate";

export async function POST(req: NextRequest) {
  try {
    const { humanUrl, garmUrl } = await req.json();
    const resultUrl = await performVirtualTryOn(garmUrl, humanUrl);
    return NextResponse.json({ resultUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
