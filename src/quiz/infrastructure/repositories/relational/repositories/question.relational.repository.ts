import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../application/repositories/question.repository';
import { Question } from '../../../../domain/entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRelationalEntity } from '../entities/question.relational-entity';
import { Repository } from 'typeorm';
import { QuestionMapper } from '../mappers/question.mapper';
import { User } from 'src/user/domain/entities/user.entity';

@Injectable()
export class QuestionRelationalRepository implements QuestionRepository {
  constructor(
    @InjectRepository(QuestionRelationalEntity)
    private readonly repository: Repository<QuestionRelationalEntity>,
  ) {}

  async save(question: Question): Promise<Question> {
    const questionRelationalEntity = QuestionMapper.toRelational(question);

    await this.repository.save(questionRelationalEntity);

    const savedQuestion = await this.repository.findOne({
      where: { id: questionRelationalEntity.id },
      relations: ['propositions', 'organization'],
    });

    if (!savedQuestion) {
      throw new Error('Question not found');
    }

    return QuestionMapper.toDomain(savedQuestion);
  }

  async findByOrganizationId({
    organizationId,
  }: {
    organizationId: string;
  }): Promise<Question[]> {
    const questions = await this.repository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.propositions', 'propositions')
      .leftJoinAndSelect('question.organization', 'organization')
      .where(`question.organization = :organizationId`)
      .setParameters({
        organizationId,
      })
      .getMany();

    return questions.map((question) => QuestionMapper.toDomain(question));
  }

  async findByUserIdSortedByLeastAnswered({
    userId,
  }: {
    userId: User['id'];
  }): Promise<Question['id'][]> {
    interface QuestionCountResult {
      questionId: Question['id'];
      count: string; // SQL COUNT returns a string in raw queries
    }

    const queryResult: QuestionCountResult[] = await this.repository
      .createQueryBuilder('question')
      .select('question.id', 'questionId')
      .addSelect('COUNT(user_answer.id)', 'count')
      .leftJoin('answer', 'answer', 'answer.question_id = question.id')
      .leftJoin(
        'user_answer',
        'user_answer',
        'user_answer.answer_id = answer.id AND user_answer.user_id = :userId AND user_answer.deleted_at IS NULL',
      )
      .setParameter('userId', userId)
      .groupBy('question.id')
      .orderBy('count', 'ASC')
      .getRawMany();

    return queryResult.map((result) => result.questionId);
  }

  async findByIds(ids: Question['id'][]): Promise<Question[]> {
    const questions = await this.repository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.propositions', 'propositions')
      .leftJoinAndSelect('question.organization', 'organization')
      .where(`question.id IN (:...ids)`, { ids })
      .getMany();

    return questions.map((question) => QuestionMapper.toDomain(question));
  }
}
