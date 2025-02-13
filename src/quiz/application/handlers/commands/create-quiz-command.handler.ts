import { Injectable } from '@nestjs/common';
import { QuizService } from '../../services/quiz.service';
import { CreateQuizDTO } from '../../dtos/create-quiz.dto';

@Injectable()
export class CreateQuizCommandHandler {
  constructor(private readonly quizService: QuizService) {}

  async handle(dto: CreateQuizDTO): Promise<void> {
    await this.quizService.createQuiz(dto);
  }
}
