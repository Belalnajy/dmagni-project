import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User } from "@/lib/entities/user.entity";
import { Subscription } from "@/lib/entities/subscription.entity";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const db = await getDB();
    const userRepo = db.getRepository(User);
    const subRepo = db.getRepository(Subscription);

    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const role = email.toLowerCase().includes("admin") ? "admin" : "user";

    const user = userRepo.create({ email, password, name, role });
    await userRepo.save(user);

    const sub = subRepo.create({ userId: user.id, tier: "free", creditsLeft: 3 });
    await subRepo.save(sub);

    return NextResponse.json({
      message: "Registered successfully",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
