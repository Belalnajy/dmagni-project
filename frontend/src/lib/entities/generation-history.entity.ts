import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import type { User } from "./user.entity";

@Entity("generation_history")
export class GenerationHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne("User", "generations")
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
