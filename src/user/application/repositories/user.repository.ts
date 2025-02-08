import { User } from '../../domain/entities/user.entity';

export abstract class UserRepository {
  abstract createUser(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
