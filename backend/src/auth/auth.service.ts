import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async login(body: any) {
    const { email, password } = body;
    const user = await this.userRepository.findOne({ where: { email } });

    // Weak check for demonstration / mock version
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(body: any) {
    const { email, password, name } = body;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Assigning admin if admin string is found... for demonstration simplicity
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';

    const user = this.userRepository.create({
      email,
      password, // cleartext for demo purposes as requested
      name,
      role,
    });

    await this.userRepository.save(user);

    // Create default free subscription
    const sub = this.subscriptionRepository.create({
      userId: user.id,
      tier: 'free',
      creditsLeft: 3,
    });
    await this.subscriptionRepository.save(sub);

    return {
      message: 'Registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
