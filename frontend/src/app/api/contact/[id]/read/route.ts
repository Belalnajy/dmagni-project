import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { ContactMessage } from "@/lib/entities";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();
    const repo = db.getRepository(ContactMessage);

    await repo.update(id, { isRead: true });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
