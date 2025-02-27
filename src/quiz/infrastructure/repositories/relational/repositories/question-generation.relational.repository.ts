import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionGenerationRepository } from '../../../../application/repositories/question-generation.repository';
import { QuestionGeneration } from '../../../../domain/entities/question-generation.entity';
import { QuestionGenerationRelationalEntity } from '../entities/question-generation.relational-entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionGenerationRelationalRepository
  implements QuestionGenerationRepository
{
  constructor(
    @InjectRepository(QuestionGenerationRelationalEntity)
    private readonly repository: Repository<QuestionGenerationRelationalEntity>,
  ) {}

  async save(questionGeneration: QuestionGeneration): Promise<void> {
    const entity = new QuestionGenerationRelationalEntity();
    entity.id = questionGeneration.id;
    entity.createdAt = questionGeneration.createdAt;
    entity.updatedAt = questionGeneration.updatedAt;
    entity.deletedAt = questionGeneration.deletedAt ?? null;

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<QuestionGeneration | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    if (!entity) {
      return null;
    }

    return new QuestionGeneration(
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt ?? undefined,
    );
  }
}
