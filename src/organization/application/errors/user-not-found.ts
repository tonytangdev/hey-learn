import { User } from 'src/user/domain/entities/user.entity';

export class UserNotFoundError extends Error {
  constructor(userId: User['id']) {
    super();
    this.name = 'UserNotFoundError';
    this.message = `User with id ${userId} not found`;
  }
}
