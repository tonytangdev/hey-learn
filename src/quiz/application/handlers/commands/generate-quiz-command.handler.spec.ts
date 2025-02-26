import { Test } from '@nestjs/testing';
import { LLMService } from '../../services/llm.service';
import { GenerateQuizCommandHandler } from './generate-quiz-command.handler';
import { QuizService } from '../../services/quiz.service';
import { GenerateQuizDTO } from '../../dtos/generate-quiz.dto';
import { randomUUID } from 'node:crypto';
import { CreateQuizDTO } from '../../dtos/create-quiz.dto';
import { faker } from '@faker-js/faker/.';

describe('GenerateQuizCommandHandler', () => {
  let handler: GenerateQuizCommandHandler;
  let llmService: LLMService;
  let quizService: QuizService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GenerateQuizCommandHandler,
        {
          provide: QuizService,
          useValue: {
            createQuiz: jest.fn(),
          },
        },
        {
          provide: LLMService,
          useValue: {
            generateQuiz: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<GenerateQuizCommandHandler>(
      GenerateQuizCommandHandler,
    );
    llmService = moduleRef.get<LLMService>(LLMService);
    quizService = moduleRef.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should generate a quiz', async () => {
    const dto: GenerateQuizDTO = {
      textInput: 'test',
      userId: randomUUID(),
      organizationId: randomUUID(),
    };

    const expectedQuestion = faker.lorem.sentence();
    const expectedAnswer = faker.lorem.sentence();
    const expectedWrongAnswers = [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
    ];

    (llmService.generateQuiz as jest.Mock).mockResolvedValueOnce([
      {
        question: expectedQuestion,
        answer: expectedAnswer,
        wrongAnswers: expectedWrongAnswers,
      },
    ]);

    await handler.handle(dto);
    expect(llmService.generateQuiz).toHaveBeenCalledWith(dto.textInput);
    expect(quizService.createQuiz).toHaveBeenCalledWith({
      question: expectedQuestion,
      answer: expectedAnswer,
      wrongAnswers: expectedWrongAnswers,
      userId: dto.userId,
      organizationId: dto.organizationId,
    });
  });
});
