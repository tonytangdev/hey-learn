import { User } from 'src/user/domain/entities/user.entity';
import { Organization } from '../../domain/entities/organization.entity';
import { Question } from '../../domain/entities/question.entity';

export abstract class QuestionRepository {
  abstract save(question: Question): Promise<Question>;
  abstract findByOrganizationId({
    organizationId,
  }: {
    organizationId: Organization['id'];
  }): Promise<Question[]>;

  abstract findByUserIdSortedByLeastAnswered({
    userId,
  }: {
    userId: User['id'];
  }): Promise<Question['id'][]>;

  abstract findByIds(ids: Question['id'][]): Promise<Question[]>;
}
