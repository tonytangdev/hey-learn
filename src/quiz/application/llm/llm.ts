import { CreateQuizDTO } from '../dtos/create-quiz.dto';

export abstract class LLM {
  abstract generateQuiz(
    textInput: string,
  ): Promise<Pick<CreateQuizDTO, 'question' | 'answer' | 'wrongAnswers'>[]>;
}
