import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationRelationalEntity } from './organization.relational-entity';
import { UserRelationalEntity } from './user.relational-entity';

@Entity({ name: 'membership' })
export class OrganizationMembershipRelationalEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => OrganizationRelationalEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: Omit<OrganizationRelationalEntity, 'createdBy'>;

  @OneToOne(() => UserRelationalEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserRelationalEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
