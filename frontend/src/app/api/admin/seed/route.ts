import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User, Subscription } from "@/lib/entities";

const ADMIN_SECRET = process.env.ADMIN_SEED_SECRET || "dmagni-seed-2026";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDB();
    const userRepo = db.getRepository(User);
    const subRepo = db.getRepository(Subscription);

    const email = "admin@dmagni.com";
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Admin account already exists", email });
    }

    const user = userRepo.create({
      email,
      password: "Admin@123",
      name: "Admin",
      role: "admin",
    });
    await userRepo.save(user);

    const sub = subRepo.create({ userId: user.id, tier: "premium", creditsLeft: 999 });
    await subRepo.save(sub);

    return NextResponse.json({
      message: "Admin account created",
      email,
      password: "Admin@123",
      note: "Change the password after first login!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
