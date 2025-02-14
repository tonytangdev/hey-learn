import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationRelationalEntity } from './organization.relational-entity';
import { AnswerRelationalEntity } from './answer.relational-entity';

@Entity({ name: 'question' })
export class QuestionRelationalEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => OrganizationRelationalEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationRelationalEntity;

  @OneToOne(() => AnswerRelationalEntity)
  @JoinColumn({ name: 'answer_id' })
  answer: AnswerRelationalEntity;

  @OneToMany(() => AnswerRelationalEntity, (answer) => answer.question)
  propositions: AnswerRelationalEntity[];

  @Column()
  value: string;

  @Column({ nullable: true })
  category: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
}
