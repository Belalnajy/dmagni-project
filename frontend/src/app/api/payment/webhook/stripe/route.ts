import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User, Subscription } from "@/lib/entities";

async function upgradeUser(subRepo: any, userId: string, tier: string) {
  let sub = await subRepo.findOne({ where: { userId } });
  if (!sub) {
    sub = subRepo.create({ userId, tier, creditsLeft: 9999 });
  } else {
    sub.tier = tier;
    sub.creditsLeft = 9999;
  }
  await subRepo.save(sub);
}

async function downgradeUser(subRepo: any, userId: string) {
  let sub = await subRepo.findOne({ where: { userId } });
  if (!sub) {
    sub = subRepo.create({ userId, tier: "free", creditsLeft: 3 });
  } else {
    sub.tier = "free";
    sub.creditsLeft = 3;
  }
  await subRepo.save(sub);
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const db = await getDB();
    const subRepo = db.getRepository(Subscription);

    if (event.type === "checkout.session.completed") {
      const userId = event.data?.object?.metadata?.userId;
      if (userId) {
        await upgradeUser(subRepo, userId, "premium");
        return NextResponse.json({ received: true, action: "upgraded" });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const userId = event.data?.object?.metadata?.userId;
      if (userId) {
        await downgradeUser(subRepo, userId);
        return NextResponse.json({ received: true, action: "downgraded" });
      }
    }

    return NextResponse.json({ received: true, action: "no_action" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
