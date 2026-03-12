import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async handleStripeWebhook(payload: any) {
    this.logger.log('Processing Stripe webhook');

    const event = payload;

    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      const userId = session?.metadata?.userId;

      if (userId) {
        await this.upgradeUser(userId, 'premium');
        this.logger.log(`User ${userId} upgraded to premium via Stripe`);
        return { received: true, action: 'upgraded' };
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data?.object;
      const userId = subscription?.metadata?.userId;

      if (userId) {
        await this.downgradeUser(userId);
        this.logger.log(`User ${userId} downgraded to free via Stripe`);
        return { received: true, action: 'downgraded' };
      }
    }

    return { received: true, action: 'no_action' };
  }

  async handlePaymobWebhook(payload: any) {
    this.logger.log('Processing Paymob webhook');

    const obj = payload.obj;

    if (obj?.success === true && obj?.is_refunded === false) {
      const userId = obj?.order?.merchant_order_id;

      if (userId) {
        await this.upgradeUser(userId, 'premium');
        this.logger.log(`User ${userId} upgraded to premium via Paymob`);
        return { received: true, action: 'upgraded' };
      }
    }

    return { received: true, action: 'no_action' };
  }

  private async upgradeUser(userId: string, tier: string) {
    let subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) {
      subscription = this.subscriptionRepository.create({
        userId,
        tier,
        creditsLeft: 9999,
      });
    } else {
      subscription.tier = tier;
      subscription.creditsLeft = 9999;
    }
    await this.subscriptionRepository.save(subscription);
  }

  private async downgradeUser(userId: string) {
    let subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) {
      subscription = this.subscriptionRepository.create({
        userId,
        tier: 'free',
        creditsLeft: 3,
      });
    } else {
      subscription.tier = 'free';
      subscription.creditsLeft = 3;
    }
    await this.subscriptionRepository.save(subscription);
  }
}
