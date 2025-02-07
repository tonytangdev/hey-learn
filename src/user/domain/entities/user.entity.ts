import { randomUUID } from 'node:crypto';
import { Email } from '../value-objects/email.value-object';

const ID_PREFIX = 'user_';

export class User {
  constructor(
    public email: Email,
    public id: string = ID_PREFIX + randomUUID(),
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {}
}
