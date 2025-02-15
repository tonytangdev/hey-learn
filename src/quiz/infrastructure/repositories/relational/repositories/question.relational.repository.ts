import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../application/repositories/question.repository';
import { Question } from '../../../../domain/entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRelationalEntity } from '../entities/question.relational-entity';
import { Repository } from 'typeorm';
import { QuestionMapper } from '../mappers/question.mapper';

@Injectable()
export class QuestionRelationalRepository implements QuestionRepository {
  constructor(
    @InjectRepository(QuestionRelationalEntity)
    private readonly repository: Repository<QuestionRelationalEntity>,
  ) {}

  async save(question: Question): Promise<Question> {
    const questionRelationalEntity = QuestionMapper.toRelational(question);

    await this.repository.save(questionRelationalEntity);

    const fetchedQuestionRelationalEntity = await this.repository.findOne({
      where: { id: question.id },
      relations: ['organization', 'answer', 'propositions'],
    });

    if (!fetchedQuestionRelationalEntity) {
      throw new Error('Question not found');
    }

    console.log({ fetchedQuestionRelationalEntity });
    return QuestionMapper.toDomain(fetchedQuestionRelationalEntity);
  }
}
