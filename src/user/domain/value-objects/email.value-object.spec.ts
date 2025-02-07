import { faker } from '@faker-js/faker';
import { Email } from './email.value-object';
import { InvalidEmailError } from '../errors/invalid-email.error';

describe('EmailValueObject', () => {
  it('should create an email value object with valid email', () => {
    const value = faker.internet.email();
    const email = new Email(value);
    expect(email).toBeInstanceOf(Email);
    expect(email.value).toEqual(value);
  });

  it('should throw an error with invalid email', () => {
    const value = faker.book.title();
    expect(() => new Email(value)).toThrow(new InvalidEmailError());
  });
});
