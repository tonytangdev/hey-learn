import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionRelationalEntity } from './question.relational-entity';

@Entity({ name: 'answer' })
export class AnswerRelationalEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(
    () => QuestionRelationalEntity,
    (question) => question.propositions,
  )
  question: QuestionRelationalEntity;

  @Column()
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
