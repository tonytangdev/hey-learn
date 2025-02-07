import { UserRepository } from '../../../../user/application/repositories/user.repository';
import { User } from '../../../../user/domain/entities/user.entity';

export class UserInMemoryRepository implements UserRepository {
  private users: User[] = [];

  createUser(user: User): Promise<User> {
    this.users.push(user);

    return Promise.resolve(user);
  }
}
