import { Injectable } from '@nestjs/common';
import { QuizService } from '../../services/quiz.service';

@Injectable()
export class GetRandomQuizQueryHandler {
  constructor(private readonly quizService: QuizService) {}

  async handle(userId: string) {
    return await this.quizService.getRandomQuiz(userId);
  }
}
