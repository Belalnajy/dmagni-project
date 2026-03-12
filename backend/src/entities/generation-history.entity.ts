import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('generation_history')
export class GenerationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.generations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  modelImgUrl: string;

  @Column()
  garmentImgUrl: string;

  @Column({ nullable: true })
  resultImgUrl: string;

  @Column({ default: 'upper_body' })
  garmentCategory: string; // "upper_body", "dress", "jacket", "other"

  @Column({ default: 'processing' })
  status: string; // "processing", "completed", "failed"

  @Column({ default: 1 })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;
}
