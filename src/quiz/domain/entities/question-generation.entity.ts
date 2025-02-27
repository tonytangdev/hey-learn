import { randomUUID } from 'node:crypto';
import { Question } from './question.entity';

const PREFIX = 'qg_';
export class QuestionGeneration {
  private question: Question;
  constructor(
    public readonly id: string = `${PREFIX}${randomUUID()}`,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
  ) {}

  setQuestion(question: Question) {
    this.question = question;
  }

  getQuestion() {
    return this.question;
  }
}
