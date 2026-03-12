import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User, Subscription, GenerationHistory } from "@/lib/entities";
import { MoreThanOrEqual, Between } from "typeorm";

export async function GET() {
  try {
    const db = await getDB();
    const userRepo = db.getRepository(User);
    const subRepo = db.getRepository(Subscription);
    const genRepo = db.getRepository(GenerationHistory);

    const [totalUsers, totalGenerations, premiumUsers, freeUsers] =
      await Promise.all([
        userRepo.count(),
        genRepo.count(),
        subRepo.count({ where: { tier: "premium" } }),
        subRepo.count({ where: { tier: "free" } }),
      ]);

    const totalCostResult = await genRepo
      .createQueryBuilder("gh")
      .select("SUM(gh.cost)", "totalCost")
      .getRawOne();

    const totalCost = totalCostResult?.totalCost || 0;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [thisWeekGens, lastWeekGens] = await Promise.all([
      genRepo.count({ where: { createdAt: MoreThanOrEqual(oneWeekAgo) } }),
      genRepo.count({
        where: { createdAt: Between(twoWeeksAgo, oneWeekAgo) },
      }),
    ]);

    const genGrowth =
      lastWeekGens > 0
        ? (((thisWeekGens - lastWeekGens) / lastWeekGens) * 100).toFixed(1)
        : "0";

    return NextResponse.json({
      totalUsers,
      totalGenerations,
      premiumUsers,
      freeUsers,
      estimatedCost: Number(totalCost) * 0.036,
      generationGrowth: `${genGrowth}%`,
      thisWeekGenerations: thisWeekGens,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
