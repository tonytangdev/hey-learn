import { UserAnswer } from '../../domain/entities/user-answer.entity';

export abstract class UserAnswerRepository {
  abstract save(userAnswer: UserAnswer): Promise<void>;
}
