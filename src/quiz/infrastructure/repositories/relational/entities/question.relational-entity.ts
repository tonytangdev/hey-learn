import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerRelationalEntity } from './answer.relational-entity';
import { OrganizationRelationalEntity } from '../../../../../user/infrastructure/repositories/relational/entities/organization.relational-entity';

@Entity({ name: 'question' })
export class QuestionRelationalEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => OrganizationRelationalEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationRelationalEntity;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @OneToOne(() => AnswerRelationalEntity)
  @JoinColumn({ name: 'answer_id' })
  answer: AnswerRelationalEntity;

  @OneToMany(() => AnswerRelationalEntity, (answer) => answer.question, {
    cascade: true,
  })
  propositions: AnswerRelationalEntity[];

  @Column()
  value: string;

  @Column({ type: String, nullable: true })
  @Index()
  category: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
}
