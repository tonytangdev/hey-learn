import { Test } from '@nestjs/testing';
import { QuizService } from '../../services/quiz.service';
import { CreateQuizCommandHandler } from './create-quiz-command.handler';
import { CreateQuizDTO } from '../../dtos/create-quiz.dto';

describe('CreateQuizCommandHandler', () => {
  let handler: CreateQuizCommandHandler;
  let quizService: QuizService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateQuizCommandHandler,
        {
          provide: QuizService,
          useValue: {
            createQuiz: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<CreateQuizCommandHandler>(CreateQuizCommandHandler);
    quizService = moduleRef.get<QuizService>(QuizService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should throw an error if quizService.createQuiz throws an error', async () => {
    const createQuizDTO = new CreateQuizDTO();
    const error = new Error('Test error');
    (quizService.createQuiz as jest.Mock).mockRejectedValue(error);

    await expect(handler.execute(createQuizDTO)).rejects.toThrow(error);
  });

  it('should call quizService.createQuiz with the correct parameters', async () => {
    const createQuizDTO = new CreateQuizDTO();

    await handler.execute(createQuizDTO);
    expect(quizService.createQuiz).toHaveBeenCalledWith(createQuizDTO);
  });
});
