import { randomUUID } from 'node:crypto';
import { User } from '../../../user/domain/entities/user.entity';
import { Organization } from './organization.entity';

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
