import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User } from "@/lib/entities/user.entity";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = await getDB();
    const userRepo = db.getRepository(User);

    const user = await userRepo.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Logged in successfully",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
