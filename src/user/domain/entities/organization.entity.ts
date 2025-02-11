import { randomUUID } from 'node:crypto';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../../../user/domain/value-objects/organization-type.value-object';
import { User } from './user.entity';

const PREFIX = 'org_';

export class Organization {
  private readonly organizationType: OrganizationType;
  constructor(
    organizationType: ORGANIZATION_TYPES,
    private createdBy?: User,
    public readonly id: string = PREFIX + randomUUID(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
  ) {
    this.organizationType = new OrganizationType(organizationType);
  }

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
