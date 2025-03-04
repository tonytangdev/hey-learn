import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRelationalEntity } from './user.relational-entity';
import { ORGANIZATION_TYPES } from '../../../../../user/domain/value-objects/organization-type.value-object';

@Entity({ name: 'organization' })
export class OrganizationRelationalEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => UserRelationalEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserRelationalEntity;

  @Column({
    enum: ORGANIZATION_TYPES,
    type: 'enum',
  })
  type: ORGANIZATION_TYPES;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
