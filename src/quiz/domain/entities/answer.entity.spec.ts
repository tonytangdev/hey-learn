import { faker } from '@faker-js/faker';
import { Answer } from './answer.entity';
import { randomUUID } from 'node:crypto';
import { MissingAnswerError } from '../errors/missing-answer-value.error';

describe('Answer', () => {
  it('should create an answer', () => {
    const answer = new Answer(faker.lorem.paragraph());
    expect(answer).toBeDefined();
    expect(answer.value).toBeTruthy();
    expect(answer.createdAt).toBeInstanceOf(Date);
    expect(answer.updatedAt).toBeInstanceOf(Date);
    expect(answer.deletedAt).toBeFalsy();
    // starts by `answer_` and ends with a uuid
    expect(answer.id).toMatch(
      /^answer_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('should create an answer with a given id', () => {
    const id = randomUUID();
    const answer = new Answer(faker.lorem.paragraph(), id);
    expect(answer).toBeDefined();
    expect(answer.value).toBeTruthy();
    expect(answer.createdAt).toBeInstanceOf(Date);
    expect(answer.updatedAt).toBeInstanceOf(Date);
    expect(answer.deletedAt).toBeFalsy();
    expect(answer.id).toBe(id);
  });

  it('should create an answer with a given id and createdAt', () => {
    const id = randomUUID();
    const createdAt = new Date();
    const answer = new Answer(faker.lorem.paragraph(), id, createdAt);
    expect(answer).toBeDefined();
    expect(answer.value).toBeTruthy();
    expect(answer.createdAt).toBe(createdAt);
    expect(answer.updatedAt).toBeInstanceOf(Date);
    expect(answer.deletedAt).toBeFalsy();
    expect(answer.id).toBe(id);
  });

  it('should create an answer with a given id, createdAt and updatedAt', () => {
    const id = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const answer = new Answer(
      faker.lorem.paragraph(),
      id,
      createdAt,
      updatedAt,
    );
    expect(answer).toBeDefined();
    expect(answer.value).toBeTruthy();
    expect(answer.createdAt).toBe(createdAt);
    expect(answer.updatedAt).toBe(updatedAt);
    expect(answer.deletedAt).toBeFalsy();
    expect(answer.id).toBe(id);
  });

  it('should create an answer with a given id, createdAt, updatedAt and deletedAt', () => {
    const id = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    const deletedAt = new Date();
    const answer = new Answer(
      faker.lorem.paragraph(),
      id,
      createdAt,
      updatedAt,
      deletedAt,
    );
    expect(answer).toBeDefined();
    expect(answer.value).toBeTruthy();
    expect(answer.createdAt).toBe(createdAt);
    expect(answer.updatedAt).toBe(updatedAt);
    expect(answer.deletedAt).toBe(deletedAt);
    expect(answer.id).toBe(id);
  });

  it('should throw an error if value is empty', () => {
    expect(() => {
      new Answer(' ');
    }).toThrow(new MissingAnswerError());
  });

  it('should trim the value', () => {
    const value = faker.lorem.sentence();
    const valueWithSpaces = `  ${value}   `;
    const answer = new Answer(valueWithSpaces);
    expect(answer.value).toBe(value);
  });
});
