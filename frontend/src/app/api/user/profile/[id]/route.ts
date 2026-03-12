import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User } from "@/lib/entities/user.entity";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();
    const userRepo = db.getRepository(User);

    const user = await userRepo.findOne({
      where: { id },
      relations: ["subscription", "generations"],
      order: { generations: { createdAt: "DESC" } },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
      generations: user.generations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
