import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User, Subscription, GenerationHistory } from "@/lib/entities";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    const user = await db.getRepository(User).findOne({ where: { id } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const subscription = await db
      .getRepository(Subscription)
      .findOne({ where: { userId: id } });

    const generations = await db
      .getRepository(GenerationHistory)
      .find({ where: { userId: id }, order: { createdAt: "DESC" } });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription,
      generations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
