import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User, Subscription } from "@/lib/entities";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { tier, role } = await req.json();
    const db = await getDB();
    const userRepo = db.getRepository(User);
    const subRepo = db.getRepository(Subscription);

    if (tier) {
      let sub = await subRepo.findOne({ where: { userId: id } });
      if (!sub) {
        sub = subRepo.create({
          userId: id,
          tier,
          creditsLeft: tier === "premium" ? 9999 : 3,
        });
      } else {
        sub.tier = tier;
        sub.creditsLeft = tier === "premium" ? 9999 : 3;
      }
      await subRepo.save(sub);
    }

    if (role) {
      await userRepo.update(id, { role });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
