import { UserRelationalEntity } from '../../../../../user/infrastructure/repositories/relational/entities/user.relational-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerRelationalEntity } from './answer.relational-entity';

@Entity({ name: 'user_answer' })
export class UserAnswerRelationalEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => UserRelationalEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserRelationalEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => AnswerRelationalEntity)
  @JoinColumn({ name: 'answer_id' })
  answer: AnswerRelationalEntity;

  @Column({ name: 'answer_id' })
  answerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
