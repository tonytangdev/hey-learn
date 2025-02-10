import { randomUUID } from 'node:crypto';
import { Email } from '../value-objects/email.value-object';
import { Organization } from './organization.entity';

const ID_PREFIX = 'user_';

export class User {
  constructor(
    private readonly email: Email,
    public readonly id: string = ID_PREFIX + randomUUID(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
    public readonly organizations: Organization[] = [],
  ) {}

  getEmail(): string {
    return this.email.value;
  }

  addOrganization(organization: Organization) {
    this.organizations.push(organization);
  }
}
