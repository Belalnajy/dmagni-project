import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Subscription } from "@/lib/entities/subscription.entity";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const obj = payload.obj;
    const db = await getDB();
    const subRepo = db.getRepository(Subscription);

    if (obj?.success === true && obj?.is_refunded === false) {
      const userId = obj?.order?.merchant_order_id;
      if (userId) {
        let sub = await subRepo.findOne({ where: { userId } });
        if (!sub) {
          sub = subRepo.create({ userId, tier: "premium", creditsLeft: 9999 });
        } else {
          sub.tier = "premium";
          sub.creditsLeft = 9999;
        }
        await subRepo.save(sub);
        return NextResponse.json({ received: true, action: "upgraded" });
      }
    }

    return NextResponse.json({ received: true, action: "no_action" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
