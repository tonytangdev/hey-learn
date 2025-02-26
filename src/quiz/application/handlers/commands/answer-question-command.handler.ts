import { Injectable } from '@nestjs/common';
import { QuizService } from '../../services/quiz.service';
import { AnswerQuizDTO } from '../../dtos/answer-quiz.dto';

@Injectable()
export class AnswerQuestionCommandHandler {
  constructor(private readonly quizService: QuizService) {}

  async handle(dto: AnswerQuizDTO): Promise<void> {
    await this.quizService.answerQuestion(dto);
  }
}
