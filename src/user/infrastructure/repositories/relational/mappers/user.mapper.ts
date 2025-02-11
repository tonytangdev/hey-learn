import { User } from '../../../../../user/domain/entities/user.entity';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { UserEntityBuilder } from '../../../../../user/domain/entities-builders/user.entity-builder';

export class UserMapper {
  static toDomain(user: UserRelationalEntity) {
    return new UserEntityBuilder()
      .withEmail(user.email)
      .withId(user.id)
      .withCreatedAt(user.createdAt)
      .withUpdatedAt(user.updatedAt)
      .withDeletedAt(user.deletedAt ?? undefined)
      .build();
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
