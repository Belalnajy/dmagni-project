import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User } from "@/lib/entities/user.entity";
import { GenerationHistory } from "@/lib/entities/generation-history.entity";
import { Between } from "typeorm";

export async function GET() {
  try {
    const db = await getDB();
    const userRepo = db.getRepository(User);
    const genRepo = db.getRepository(GenerationHistory);

    const now = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyData: {
      name: string;
      date: string;
      merges: number;
      newUsers: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [merges, newUsers] = await Promise.all([
        genRepo.count({ where: { createdAt: Between(dayStart, dayEnd) } }),
        userRepo.count({ where: { createdAt: Between(dayStart, dayEnd) } }),
      ]);

      dailyData.push({
        name: days[dayStart.getDay()],
        date: dayStart.toISOString().split("T")[0],
        merges,
        newUsers,
      });
    }

    const categories = await genRepo
      .createQueryBuilder("gh")
      .select("gh.garmentCategory", "garmentCategory")
      .addSelect("COUNT(gh.id)", "count")
      .groupBy("gh.garmentCategory")
      .getRawMany();

    const totalGens = categories.reduce((s, c) => s + Number(c.count), 0);
    const categoryLabels: Record<string, string> = {
      upper_body: "T-Shirts",
      dress: "Dresses",
      jacket: "Jackets",
      other: "Other",
    };
    const categoryColors: Record<string, string> = {
      upper_body: "#7c3aed",
      dress: "#6366f1",
      jacket: "#3b82f6",
      other: "#8b5cf6",
    };

    const garmentTypes = categories.map((c) => ({
      name: categoryLabels[c.garmentCategory] || c.garmentCategory,
      value:
        totalGens > 0 ? Math.round((Number(c.count) / totalGens) * 100) : 0,
      count: Number(c.count),
      color: categoryColors[c.garmentCategory] || "#a78bfa",
    }));

    return NextResponse.json({ dailyData, garmentTypes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
