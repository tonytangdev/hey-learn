import { Organization } from '../../domain/entities/organization.entity';
import { Question } from '../../domain/entities/question.entity';

export abstract class QuestionRepository {
  abstract save(question: Question): Promise<Question>;
  abstract findRandomQuestions({
    organizationId,
  }: {
    organizationId: Organization['id'];
  }): Promise<Question[]>;
}
