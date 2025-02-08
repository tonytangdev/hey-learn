import { User } from 'src/user/domain/entities/user.entity';
import {
  OrganizationType,
  ORGANIZATION_TYPES,
} from '../value-objects/organization-type.value-object';
import { randomUUID } from 'node:crypto';

const PREFIX = 'org_';

export class Organization {
  constructor(
    private readonly organizationType: OrganizationType,
    public readonly id: string = PREFIX + randomUUID(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    private createdBy?: User,
    public readonly deletedAt?: Date,
  ) {}

  public getOrganizationType(): ORGANIZATION_TYPES {
    return this.organizationType.value;
  }

  public getCreatedBy(): User | undefined {
    return this.createdBy;
  }

  public setCreatedBy(user: User): void {
    this.createdBy = user;
  }
}
