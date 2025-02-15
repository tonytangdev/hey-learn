import { randomUUID } from 'node:crypto';
import { MissingAnswerError } from '../errors/missing-answer-value.error';

const PREFIX = 'answer_';

export class Answer {
  public readonly value: string;

  constructor(
    value: string,
    public readonly id: string = PREFIX + randomUUID(),
    public readonly isCorrect: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
  ) {
    const trimmedValue = value.trim();
    if (trimmedValue.length < 1) {
      throw new MissingAnswerError();
    }

    this.value = trimmedValue;
  }
}
