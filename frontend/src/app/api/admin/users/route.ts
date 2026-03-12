import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User } from "@/lib/entities";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const db = await getDB();
    const userRepo = db.getRepository(User);

    const [users, total] = await userRepo.findAndCount({
      relations: ["subscription", "generations"],
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name || "Unknown",
        email: u.email,
        role: u.role,
        plan: u.subscription?.tier || "free",
        creditsLeft: u.subscription?.creditsLeft ?? 3,
        totalMerges: u.generations.length,
        joinedAt: u.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
