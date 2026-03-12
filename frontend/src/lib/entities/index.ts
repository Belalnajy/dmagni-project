import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: "user" })
  role: string;

  @OneToMany(() => GenerationHistory, (g) => g.user)
  generations: GenerationHistory[];

  @OneToOne(() => Subscription, (s) => s.user)
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity("subscriptions")
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, (u) => u.subscription)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ default: "free" })
  tier: string;

  @Column({ default: 3 })
  creditsLeft: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity("generation_history")
export class GenerationHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.generations)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  modelImgUrl: string;

  @Column()
  garmentImgUrl: string;

  @Column({ nullable: true })
  resultImgUrl: string;

  @Column({ default: "upper_body" })
  garmentCategory: string;

  @Column({ default: "processing" })
  status: string;

  @Column({ default: 1 })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity("contact_messages")
export class ContactMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: "text" })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
