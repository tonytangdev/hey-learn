import { randomUUID } from 'node:crypto';
import { Answer } from './answer.entity';
import { Organization } from './organization.entity';
import { MissingQuestionPropositionsError } from '../errors/missing-question-propositions.error';
import { MissingQuestionValueError } from '../errors/missing-question-value.error';

const PREFIX = 'question_';

export class Question {
  public readonly value: string;

  constructor(
    value: string,
    public readonly organization: Organization,
    public readonly answer: Answer,
    public readonly propositions: Answer[],
    public readonly category?: string,
    public readonly id: string = PREFIX + randomUUID(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
  ) {
    const trimmedValue = value.trim();
    if (trimmedValue.length < 1) {
      throw new MissingQuestionValueError();
    }
    if (propositions.length < 2) {
      throw new MissingQuestionPropositionsError();
    }

    this.value = trimmedValue;
  }

  getAnswer() {
    return this.answer.value;
  }
}
