import { Email } from '../../../../../user/domain/value-objects/email.value-object';
import { User } from '../../../../../user/domain/entities/user.entity';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { faker } from '@faker-js/faker/';
import { UserMapper } from './user.mapper';
import { randomUUID } from 'node:crypto';

describe.only('UserMapper', () => {
  it.each([
    new User(new Email(faker.internet.email())),
    new User(
      new Email(faker.internet.email()),
      randomUUID(),
      faker.date.past(),
      faker.date.past(),
      faker.date.past(),
    ),
  ])('should return an entity to persist', (user) => {
    const userRelationalEntity = UserMapper.toPersistence(user);
    expect(userRelationalEntity).toBeInstanceOf(UserRelationalEntity);
    expect(userRelationalEntity.id).toBe(user.id);
    expect(userRelationalEntity.email).toBe(user.getEmail());
    expect(userRelationalEntity.createdAt).toBe(user.createdAt);
    expect(userRelationalEntity.updatedAt).toBe(user.updatedAt);
    expect(userRelationalEntity.deletedAt).toBe(user.deletedAt ?? null);
  });

  it.each([null, faker.date.past()])(
    'should return an entity to domain',
    (date) => {
      const userRelationalEntity = new UserRelationalEntity();
      userRelationalEntity.id = randomUUID();
      userRelationalEntity.email = faker.internet.email();
      userRelationalEntity.createdAt = faker.date.past();
      userRelationalEntity.updatedAt = faker.date.past();
      userRelationalEntity.deletedAt = date;
      const user = UserMapper.toDomain(userRelationalEntity);
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(userRelationalEntity.id);
      expect(user.getEmail()).toBe(userRelationalEntity.email);
      expect(user.createdAt).toBe(userRelationalEntity.createdAt);
      expect(user.updatedAt).toBe(userRelationalEntity.updatedAt);
      expect(user.deletedAt).toBe(date ?? undefined);
    },
  );
});
