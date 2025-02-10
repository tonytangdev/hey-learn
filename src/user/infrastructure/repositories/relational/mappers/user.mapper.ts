import { Email } from '../../../../../user/domain/value-objects/email.value-object';
import { User } from '../../../../../user/domain/entities/user.entity';
import { UserRelationalEntity } from '../entities/user.relational-entity';

export class UserMapper {
  static toDomain(user: UserRelationalEntity) {
    const email = new Email(user.email);
    return new User(
      email,
      user.id,
      user.createdAt,
      user.updatedAt,
      user.deletedAt ?? undefined,
    );
  }

  static toPersistence(user: User) {
    const userRelationalEntity = new UserRelationalEntity();
    userRelationalEntity.id = user.id;
    userRelationalEntity.email = user.getEmail();
    userRelationalEntity.createdAt = user.createdAt;
    userRelationalEntity.updatedAt = user.updatedAt;
    userRelationalEntity.deletedAt = user.deletedAt ?? null;
    return userRelationalEntity;
  }
}
