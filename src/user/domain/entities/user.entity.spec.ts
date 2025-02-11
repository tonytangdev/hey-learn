import { User } from './user.entity';
import { Email } from '../value-objects/email.value-object';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { UserEntityBuilder } from '../entities-builders/user.entity-builder';

describe('User entity', () => {
  it('should create a user with default values if no arguments are provided', () => {
    const email = faker.internet.email();
    const user = new UserEntityBuilder().withEmail(email).build();
    expect(user.getEmail()).toBe(email);
    expect(user.id).toMatch(
      /^user_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    );
    expect(user.createdAt instanceof Date).toBeTruthy();
    expect(user.updatedAt instanceof Date).toBeTruthy();
    expect(user.deletedAt).toBeUndefined();
  });

  it('should create a user with provided values', () => {
    const email = faker.internet.email();
    const id = randomUUID();
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();
    const deletedAt = faker.date.future();

    const user = new UserEntityBuilder()
      .withEmail(email)
      .withId(id)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .withDeletedAt(deletedAt)
      .build();

    expect(user.id).toEqual(id);
    expect(user.getEmail()).toEqual(email);
    expect(user.createdAt).toEqual(createdAt);
    expect(user.updatedAt).toEqual(updatedAt);
    expect(user.deletedAt).toEqual(deletedAt);
  });

  it('should generate a unique ID with the prefix "user_"', () => {
    const user1 = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const user2 = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();

    expect(user1.id).toMatch(/^user_/);
    expect(user2.id).toMatch(/^user_/);
    expect(user1.id).not.toEqual(user2.id);
  });
});
