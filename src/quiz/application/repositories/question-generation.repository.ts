import { QuestionGeneration } from '../../domain/entities/question-generation.entity';

export abstract class QuestionGenerationRepository {
  abstract save(questionGeneration: QuestionGeneration): Promise<void>;
  abstract findById(id: string): Promise<QuestionGeneration | null>;
}
