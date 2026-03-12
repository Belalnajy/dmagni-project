import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User, GenerationHistory } from "@/lib/entities";
import { MoreThanOrEqual } from "typeorm";

export async function GET() {
  try {
    const db = await getDB();
    const userRepo = db.getRepository(User);
    const genRepo = db.getRepository(GenerationHistory);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalThisMonth, completedThisMonth, failedThisMonth] =
      await Promise.all([
        genRepo.count({
          where: { createdAt: MoreThanOrEqual(thirtyDaysAgo) },
        }),
        genRepo.count({
          where: {
            createdAt: MoreThanOrEqual(thirtyDaysAgo),
            status: "completed",
          },
        }),
        genRepo.count({
          where: {
            createdAt: MoreThanOrEqual(thirtyDaysAgo),
            status: "failed",
          },
        }),
      ]);

    const usersWithGens = await userRepo.find({
      relations: ["generations", "subscription"],
      take: 50,
    });

    const sortedTopUsers = usersWithGens
      .map((u) => ({ ...u, generationCount: u.generations.length }))
      .sort((a, b) => b.generationCount - a.generationCount)
      .slice(0, 10);

    const dailyCosts: { date: string; cost: number; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const agg = await genRepo
        .createQueryBuilder("gh")
        .where("gh.createdAt BETWEEN :start AND :end", {
          start: dayStart,
          end: dayEnd,
        })
        .select("SUM(gh.cost)", "totalCost")
        .addSelect("COUNT(gh.id)", "count")
        .getRawOne();

      dailyCosts.push({
        date: dayStart.toISOString().split("T")[0],
        cost: (Number(agg?.totalCost) || 0) * 0.036,
        count: Number(agg?.count) || 0,
      });
    }

    return NextResponse.json({
      totalThisMonth,
      completedThisMonth,
      failedThisMonth,
      successRate:
        totalThisMonth > 0
          ? ((completedThisMonth / totalThisMonth) * 100).toFixed(1)
          : "0",
      estimatedMonthlyCost: totalThisMonth * 0.036,
      topUsers: sortedTopUsers.map((u) => ({
        id: u.id,
        name: u.name || "Unknown",
        email: u.email,
        plan: u.subscription?.tier || "free",
        totalMerges: u.generationCount,
      })),
      dailyCosts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
