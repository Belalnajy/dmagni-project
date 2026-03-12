import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThanOrEqual } from 'typeorm';
import { User } from '../entities/user.entity';
import { Subscription } from '../entities/subscription.entity';
import { GenerationHistory } from '../entities/generation-history.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(GenerationHistory)
    private readonly generationHistoryRepository: Repository<GenerationHistory>,
  ) {}

  async getStats() {
    const [totalUsers, totalGenerations, premiumUsers, freeUsers] =
      await Promise.all([
        this.userRepository.count(),
        this.generationHistoryRepository.count(),
        this.subscriptionRepository.count({ where: { tier: 'premium' } }),
        this.subscriptionRepository.count({ where: { tier: 'free' } }),
      ]);

    const totalCostResult = await this.generationHistoryRepository
      .createQueryBuilder('gh')
      .select('SUM(gh.cost)', 'totalCost')
      .getRawOne();

    const totalCost = totalCostResult?.totalCost || 0;

    // Weekly comparison
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [thisWeekGens, lastWeekGens] = await Promise.all([
      this.generationHistoryRepository.count({
        where: { createdAt: MoreThanOrEqual(oneWeekAgo) },
      }),
      this.generationHistoryRepository.count({
        where: { createdAt: Between(twoWeeksAgo, oneWeekAgo) },
      }),
    ]);

    const genGrowth =
      lastWeekGens > 0
        ? (((thisWeekGens - lastWeekGens) / lastWeekGens) * 100).toFixed(1)
        : '0';

    return {
      totalUsers,
      totalGenerations,
      premiumUsers,
      freeUsers,
      estimatedCost: Number(totalCost) * 0.036,
      generationGrowth: `${genGrowth}%`,
      thisWeekGenerations: thisWeekGens,
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      relations: ['subscription', 'generations'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name || 'Unknown',
        email: u.email,
        role: u.role,
        plan: u.subscription?.tier || 'free',
        creditsLeft: u.subscription?.creditsLeft ?? 3,
        totalMerges: u.generations.length,
        joinedAt: u.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(id: string, data: { tier?: string; role?: string }) {
    if (data.tier) {
      let sub = await this.subscriptionRepository.findOne({
        where: { userId: id },
      });
      if (!sub) {
        sub = this.subscriptionRepository.create({
          userId: id,
          tier: data.tier,
          creditsLeft: data.tier === 'premium' ? 9999 : 3,
        });
      } else {
        sub.tier = data.tier;
        sub.creditsLeft = data.tier === 'premium' ? 9999 : 3;
      }
      await this.subscriptionRepository.save(sub);
    }
    if (data.role) {
      await this.userRepository.update(id, { role: data.role });
    }
    return { success: true };
  }

  async getAnalytics() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData: { name: string; date: string; merges: number; newUsers: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [merges, newUsers] = await Promise.all([
        this.generationHistoryRepository.count({
          where: { createdAt: Between(dayStart, dayEnd) },
        }),
        this.userRepository.count({
          where: { createdAt: Between(dayStart, dayEnd) },
        }),
      ]);

      dailyData.push({
        name: days[dayStart.getDay()],
        date: dayStart.toISOString().split('T')[0],
        merges,
        newUsers,
      });
    }

    const categories = await this.generationHistoryRepository
      .createQueryBuilder('gh')
      .select('gh.garmentCategory', 'garmentCategory')
      .addSelect('COUNT(gh.id)', 'count')
      .groupBy('gh.garmentCategory')
      .getRawMany();

    const totalGens = categories.reduce((s, c) => s + Number(c.count), 0);
    const categoryLabels: Record<string, string> = {
      upper_body: 'T-Shirts',
      dress: 'Dresses',
      jacket: 'Jackets',
      other: 'Other',
    };
    const categoryColors: Record<string, string> = {
      upper_body: '#7c3aed',
      dress: '#6366f1',
      jacket: '#3b82f6',
      other: '#8b5cf6',
    };

    const garmentTypes = categories.map((c) => ({
      name: categoryLabels[c.garmentCategory] || c.garmentCategory,
      value:
        totalGens > 0 ? Math.round((Number(c.count) / totalGens) * 100) : 0,
      count: Number(c.count),
      color: categoryColors[c.garmentCategory] || '#a78bfa',
    }));

    return { dailyData, garmentTypes };
  }

  async getUsageAnalysis() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalThisMonth, completedThisMonth, failedThisMonth] =
      await Promise.all([
        this.generationHistoryRepository.count({
          where: { createdAt: MoreThanOrEqual(thirtyDaysAgo) },
        }),
        this.generationHistoryRepository.count({
          where: {
            createdAt: MoreThanOrEqual(thirtyDaysAgo),
            status: 'completed',
          },
        }),
        this.generationHistoryRepository.count({
          where: {
            createdAt: MoreThanOrEqual(thirtyDaysAgo),
            status: 'failed',
          },
        }),
      ]);

    // This is a bit inefficient for TypeORM compared to Prisma's count relation,
    // but works for basic needs. In production, a better query would be used.
    const topUsersRaw = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.generations', 'generation')
      .leftJoinAndSelect('user.subscription', 'subscription')
      .loadRelationCountAndMap('user.generationCount', 'user.generations')
      .orderBy('COUNT(generation.id)', 'DESC')
      .groupBy('user.id')
      .addGroupBy('subscription.id')
      .take(10)
      .getMany();

    // Use a simpler approach for top users to avoid complex group by issues in first pass
    const usersWithGens = await this.userRepository.find({
      relations: ['generations', 'subscription'],
      take: 50, // Get some users and sort manually if needed, or use raw query
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

      const agg = await this.generationHistoryRepository
        .createQueryBuilder('gh')
        .where('gh.createdAt BETWEEN :start AND :end', {
          start: dayStart,
          end: dayEnd,
        })
        .select('SUM(gh.cost)', 'totalCost')
        .addSelect('COUNT(gh.id)', 'count')
        .getRawOne();

      dailyCosts.push({
        date: dayStart.toISOString().split('T')[0],
        cost: (Number(agg?.totalCost) || 0) * 0.036,
        count: Number(agg?.count) || 0,
      });
    }

    return {
      totalThisMonth,
      completedThisMonth,
      failedThisMonth,
      successRate:
        totalThisMonth > 0
          ? ((completedThisMonth / totalThisMonth) * 100).toFixed(1)
          : '0',
      estimatedMonthlyCost: totalThisMonth * 0.036,
      topUsers: sortedTopUsers.map((u) => ({
        id: u.id,
        name: u.name || 'Unknown',
        email: u.email,
        plan: u.subscription?.tier || 'free',
        totalMerges: u.generationCount,
      })),
      dailyCosts,
    };
  }
}
