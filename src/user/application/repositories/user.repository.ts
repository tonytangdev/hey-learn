import { Repository } from 'src/shared/interfaces/repository';
import { User } from '../../domain/entities/user.entity';

export abstract class UserRepository implements Repository {
  abstract createUser(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
