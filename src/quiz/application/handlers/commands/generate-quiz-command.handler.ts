import { Injectable, Logger } from '@nestjs/common';
import { QuizService } from '../../services/quiz.service';
import { GenerateQuizDTO } from '../../dtos/generate-quiz.dto';
import { LLMService } from '../../services/llm.service';

@Injectable()
export class GenerateQuizCommandHandler {
  private readonly logger = new Logger(GenerateQuizCommandHandler.name);

  constructor(
    private readonly quizService: QuizService,
    private readonly llmService: LLMService,
  ) {}

  async handle(dto: GenerateQuizDTO): Promise<void> {
    try {
      const quizzesToCreate = await this.llmService.generateQuiz(dto.textInput);
      for (const quizToCreate of quizzesToCreate) {
        console.log(quizToCreate);
        await this.quizService.createQuiz({
          ...quizToCreate,
          userId: dto.userId,
          organizationId: dto.organizationId,
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
