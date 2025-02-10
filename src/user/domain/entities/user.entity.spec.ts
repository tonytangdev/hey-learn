import { User } from './user.entity';
import { Email } from '../value-objects/email.value-object';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { Organization } from './organization.entity';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../value-objects/organization-type.value-object';

describe('User entity', () => {
  it('should create a user with default values if no arguments are provided', () => {
    const email = new Email(faker.internet.email());
    const user = new User(email);

    expect(user.getEmail()).toBe(email.value);
    expect(user.id).toMatch(
      /^user_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    );
    expect(user.createdAt instanceof Date).toBeTruthy();
    expect(user.updatedAt instanceof Date).toBeTruthy();
    expect(user.deletedAt).toBeUndefined();
  });

  it('should create a user with provided values', () => {
    const email = new Email(faker.internet.email());
    const id = randomUUID();
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();
    const deletedAt = faker.date.future();

    const user = new User(email, id, createdAt, updatedAt, deletedAt);
    expect(user.id).toEqual(id);
    expect(user.getEmail()).toEqual(email.value);
    expect(user.createdAt).toEqual(createdAt);
    expect(user.updatedAt).toEqual(updatedAt);
    expect(user.deletedAt).toEqual(deletedAt);
  });

  it('should generate a unique ID with the prefix "user_"', () => {
    const email1 = new Email(faker.internet.email());
    const user1 = new User(email1);
    const email2 = new Email(faker.internet.email());
    const user2 = new User(email2);

    expect(user1.id).toMatch(/^user_/);
    expect(user2.id).toMatch(/^user_/);
    expect(user1.id).not.toEqual(user2.id);
  });
});
