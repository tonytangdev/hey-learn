import { UserEntityBuilder } from './user.entity-builder';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { EmailRequiredError } from '../errors/email-required.error';

describe('UserEntityBuilder', () => {
  it('should build a user with the given properties', () => {
    const email = faker.internet.email();
    const id = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const deletedAt = new Date();

    const user = new UserEntityBuilder()
      .withEmail(email)
      .withId(id)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .withDeletedAt(deletedAt)
      .build();

    expect(user.getEmail()).toBe(email);
    expect(user.id).toBe(id);
    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
    expect(user.deletedAt).toBe(deletedAt);
  });

  it('should build a user with default properties', () => {
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    expect(user.getEmail()).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.deletedAt).toBeUndefined();
  });

  it('should throw an error if email is not provided', () => {
    expect(() => new UserEntityBuilder().build()).toThrow(
      new EmailRequiredError(),
    );
  });
});
