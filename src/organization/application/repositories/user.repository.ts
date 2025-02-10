import { User } from '../../../user/domain/entities/user.entity';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
}
