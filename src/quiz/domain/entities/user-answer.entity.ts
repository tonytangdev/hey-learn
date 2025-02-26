import { User } from '../../../user/domain/entities/user.entity';
import { Answer } from './answer.entity';
import { randomUUID } from 'node:crypto';

const PREFIX = 'user_answer';

export class UserAnswer {
  constructor(
    public readonly userId: User['id'],
    public readonly answerId: Answer['id'],
    public readonly id: string = `${PREFIX}_${randomUUID()}`,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
  ) {}
}
