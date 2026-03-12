import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { ContactMessage } from "@/lib/entities/contact-message.entity";

export async function GET() {
  try {
    const db = await getDB();
    const repo = db.getRepository(ContactMessage);
    const messages = await repo.find({ order: { createdAt: "DESC" } });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    const db = await getDB();
    const repo = db.getRepository(ContactMessage);

    const newMessage = repo.create({ name, email, message });
    await repo.save(newMessage);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
