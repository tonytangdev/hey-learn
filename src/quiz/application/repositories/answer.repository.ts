import { Answer } from '../../domain/entities/answer.entity';

export abstract class AnswerRepository {
  abstract save(answer: Answer): Promise<Answer>;
}
