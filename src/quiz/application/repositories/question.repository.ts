import { Question } from '../../domain/entities/question.entity';

export abstract class QuestionRepository {
  abstract save(question: Question): Promise<Question>;
}
