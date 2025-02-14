import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'membership' })
export class OrganizationMembershipRelationalEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  organizationId: string;

  @Column()
  userId: string;
}
