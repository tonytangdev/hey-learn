import { Test } from '@nestjs/testing';
import { AnswerRepository } from '../repositories/answer.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { QuestionRepository } from '../repositories/question.repository';
import { QuizService } from './quiz.service';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { OrganizationNotFoundError } from '../errors/organization-not-found.error';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { Transaction } from '../../../shared/interfaces/transaction';
import { Organization } from '../../domain/entities/organization.entity';
import { CreateQuizError } from '../errors/create-quiz.error';

describe('Quiz service', () => {
  let quizService: QuizService;
  let questionRepository: QuestionRepository;
  let answersRepository: AnswerRepository;
  let organizationRepository: OrganizationRepository;
  let transactionManager: TransactionManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: QuestionRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: AnswerRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: OrganizationRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_MANAGER,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    quizService = moduleRef.get<QuizService>(QuizService);
    questionRepository = moduleRef.get<QuestionRepository>(QuestionRepository);
    answersRepository = moduleRef.get<AnswerRepository>(AnswerRepository);
    organizationRepository = moduleRef.get<OrganizationRepository>(
      OrganizationRepository,
    );
    transactionManager = moduleRef.get<TransactionManager>(TRANSACTION_MANAGER);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(quizService).toBeDefined();
  });

  it('should throw an error if the organization does not exist', async () => {
    (organizationRepository.findById as jest.Mock).mockResolvedValue(null);

    const organizationId = randomUUID();
    const dto = new CreateQuizDTO();
    dto.organizationId = organizationId;

    await expect(quizService.createQuiz(dto)).rejects.toThrow(
      new OrganizationNotFoundError(organizationId),
    );
  });

  it('should create a quiz', async () => {
    const transaction: Transaction = {
      getRepository: jest
        .fn()
        .mockImplementationOnce(() => questionRepository)
        .mockImplementation(() => answersRepository),
    };

    (transactionManager.execute as jest.Mock).mockImplementationOnce(
      async (operation: (transaction: Transaction) => Promise<void>) => {
        await operation(transaction);
      },
    );

    const organizationId = randomUUID();
    (organizationRepository.findById as jest.Mock).mockResolvedValue(
      new Organization(organizationId),
    );

    const dto = new CreateQuizDTO();
    dto.organizationId = organizationId;
    dto.question = faker.lorem.sentence();
    dto.answer = faker.lorem.sentence();
    dto.wrongAnswers = [faker.lorem.sentence(), faker.lorem.sentence()];

    await quizService.createQuiz(dto);

    expect(transactionManager.execute).toHaveBeenCalled();
  });

  it('should throw an error if questionRepository throws an error', async () => {
    (questionRepository.save as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );

    const transaction: Transaction = {
      getRepository: jest
        .fn()
        .mockImplementationOnce(() => questionRepository)
        .mockImplementation(() => answersRepository),
    };
    (transactionManager.execute as jest.Mock).mockImplementationOnce(
      async (operation: (transaction: Transaction) => Promise<void>) => {
        await operation(transaction);
      },
    );
    const organizationId = randomUUID();
    (organizationRepository.findById as jest.Mock).mockResolvedValue(
      new Organization(organizationId),
    );
    const dto = new CreateQuizDTO();
    dto.organizationId = organizationId;
    dto.question = faker.lorem.sentence();
    dto.answer = faker.lorem.sentence();
    dto.wrongAnswers = [faker.lorem.sentence(), faker.lorem.sentence()];

    await expect(quizService.createQuiz(dto)).rejects.toThrow(
      new CreateQuizError(),
    );
  });

  it('should throw an error if answersRepository throws an error', async () => {
    (answersRepository.save as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );
    const transaction: Transaction = {
      getRepository: jest
        .fn()
        .mockImplementationOnce(() => questionRepository)
        .mockImplementation(() => answersRepository),
    };
    (transactionManager.execute as jest.Mock).mockImplementationOnce(
      async (operation: (transaction: Transaction) => Promise<void>) => {
        await operation(transaction);
      },
    );
    const organizationId = randomUUID();
    (organizationRepository.findById as jest.Mock).mockResolvedValue(
      new Organization(organizationId),
    );
    const dto = new CreateQuizDTO();
    dto.organizationId = organizationId;
    dto.question = faker.lorem.sentence();
    dto.answer = faker.lorem.sentence();
    dto.wrongAnswers = [faker.lorem.sentence(), faker.lorem.sentence()];

    await expect(quizService.createQuiz(dto)).rejects.toThrow(
      new CreateQuizError(),
    );
  });
});
