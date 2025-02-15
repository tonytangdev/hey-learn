import { Injectable } from '@nestjs/common';
import { AnswerRepository } from '../../../../application/repositories/answer.repository';
import { Answer } from '../../../../domain/entities/answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerRelationalEntity } from '../entities/answer.relational-entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerRelationalRepository implements AnswerRepository {
  constructor(
    @InjectRepository(AnswerRelationalEntity)
    private readonly repository: Repository<AnswerRelationalEntity>,
  ) {}

  async save(answer: Answer): Promise<Answer> {
    const answerEntity = new AnswerRelationalEntity();
    answerEntity.id = answer.id;
    answerEntity.value = answer.value;
    answerEntity.createdAt = answer.createdAt;
    answerEntity.updatedAt = answer.updatedAt;
    answerEntity.deletedAt = answer.deletedAt ?? null;

    console.log({ answerEntity });

    const res = await this.repository.insert(answerEntity);

    const savedAnswer = res.generatedMaps[0] as AnswerRelationalEntity;

    console.log({ savedAnswer });

    return new Answer(
      savedAnswer.value,
      savedAnswer.id,
      savedAnswer.createdAt,
      savedAnswer.updatedAt,
      savedAnswer.deletedAt ?? undefined,
    );
  }
}
