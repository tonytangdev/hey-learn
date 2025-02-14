import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'organization' })
export class OrganizationRelationalEntity {
  @PrimaryColumn()
  id: string;
}
