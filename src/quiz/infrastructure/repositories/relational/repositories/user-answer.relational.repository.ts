import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAnswerRepository } from '../../../../../quiz/application/repositories/user-answer.repository';
import { Repository } from 'typeorm';
import { UserAnswerRelationalEntity } from '../entities/user-answer.relational-entity';
import { UserAnswer } from '../../../../../quiz/domain/entities/user-answer.entity';

@Injectable()
export class UserAnswerRelationalRepository implements UserAnswerRepository {
  constructor(
    @InjectRepository(UserAnswerRelationalEntity)
    private readonly repository: Repository<UserAnswerRelationalEntity>,
  ) {}

  async save(userAnswer: UserAnswer): Promise<void> {
    const userAnswerRelationalEntity = {
      id: userAnswer.id,
      answer: {
        id: userAnswer.answerId,
      },
      user: {
        id: userAnswer.userId,
      },
    };

    await this.repository.save(userAnswerRelationalEntity);
  }
}
