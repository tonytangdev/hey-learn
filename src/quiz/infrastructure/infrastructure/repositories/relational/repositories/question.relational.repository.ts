import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../../application/repositories/question.repository';
import { Question } from '../../../../../domain/entities/question.entity';
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

    const savedQuestionRelationalEntity = await this.repository.save(
      questionRelationalEntity,
    );

    return QuestionMapper.toDomain(savedQuestionRelationalEntity);
  }
}
