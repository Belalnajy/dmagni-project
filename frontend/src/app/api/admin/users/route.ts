import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User, Subscription, GenerationHistory } from "@/lib/entities";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const db = await getDB();
    const userRepo = db.getRepository(User);
    const subRepo = db.getRepository(Subscription);
    const genRepo = db.getRepository(GenerationHistory);

    const [users, total] = await userRepo.findAndCount({
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    const enriched = await Promise.all(
      users.map(async (u) => {
        const sub = await subRepo.findOne({ where: { userId: u.id } });
        const genCount = await genRepo.count({ where: { userId: u.id } });
        return {
          id: u.id,
          name: u.name || "Unknown",
          email: u.email,
          role: u.role,
          plan: sub?.tier || "free",
          creditsLeft: sub?.creditsLeft ?? 3,
          totalMerges: genCount,
          joinedAt: u.createdAt,
        };
      })
    );

    return NextResponse.json({
      users: enriched,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
