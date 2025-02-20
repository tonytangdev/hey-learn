import { Injectable } from '@nestjs/common';
import { QuizService } from '../../services/quiz.service';
import { GenerateQuizDTO } from '../../dtos/generate-quiz.dto';
import { LLMService } from '../../services/llm.service';

@Injectable()
export class GenerateQuizCommandHandler {
  constructor(
    private readonly quizService: QuizService,
    private readonly llmService: LLMService,
  ) {}

  async handle(dto: GenerateQuizDTO): Promise<void> {
    const quizToCreate = await this.llmService.generateQuiz(dto.textInput);
    await this.quizService.createQuiz({
      ...quizToCreate,
      userId: dto.userId,
      organizationId: dto.organizationId,
    });
  }
}
