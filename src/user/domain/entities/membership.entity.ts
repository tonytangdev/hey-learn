import { randomUUID } from 'node:crypto';
import { Organization } from './organization.entity';
import { User } from './user.entity';

const PREFIX = 'memb_';

export class Membership {
  constructor(
    public readonly user: User,
    public readonly organization: Organization,
    public readonly id: string = PREFIX + randomUUID(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
  ) {}
}
