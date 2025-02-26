import { Test } from '@nestjs/testing';
import { QuestionRepository } from '../repositories/question.repository';
import { QuizService } from './quiz.service';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { Transaction } from '../../../shared/interfaces/transaction';
import { CreateQuizError } from '../errors/create-quiz.error';
import { UserNotMemberOfOrganizationError } from '../errors/user-not-member-of-organization.error';
import { Membership } from '../../../user/domain/entities/membership.entity';
import { OrganizationMembershipService } from '../../../user/application/services/organization-membership.service';

describe('Quiz service', () => {
  let quizService: QuizService;
  let questionRepository: QuestionRepository;
  let organizationMembershipService: OrganizationMembershipService;
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
          provide: OrganizationMembershipService,
          useValue: {
            findByOrganizationIdAndUserId: jest.fn(),
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
    organizationMembershipService =
      moduleRef.get<OrganizationMembershipService>(
        OrganizationMembershipService,
      );
    transactionManager = moduleRef.get<TransactionManager>(TRANSACTION_MANAGER);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(quizService).toBeDefined();
  });

  it('should create a quiz', async () => {
    (
      organizationMembershipService.findByOrganizationIdAndUserId as jest.Mock
    ).mockResolvedValue({} as unknown as Membership);

    const transaction: Transaction = {
      getRepository: jest.fn().mockImplementationOnce(() => questionRepository),
    };

    (transactionManager.execute as jest.Mock).mockImplementationOnce(
      async (operation: (transaction: Transaction) => Promise<void>) => {
        await operation(transaction);
      },
    );

    const dto = new CreateQuizDTO();
    dto.organizationId = randomUUID();
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

    (
      organizationMembershipService.findByOrganizationIdAndUserId as jest.Mock
    ).mockResolvedValue({} as unknown as Membership);

    const transaction: Transaction = {
      getRepository: jest.fn().mockImplementationOnce(() => questionRepository),
    };
    (transactionManager.execute as jest.Mock).mockImplementationOnce(
      async (operation: (transaction: Transaction) => Promise<void>) => {
        await operation(transaction);
      },
    );

    const dto = new CreateQuizDTO();
    dto.organizationId = randomUUID();
    dto.question = faker.lorem.sentence();
    dto.answer = faker.lorem.sentence();
    dto.wrongAnswers = [faker.lorem.sentence(), faker.lorem.sentence()];

    await expect(quizService.createQuiz(dto)).rejects.toThrow(
      new CreateQuizError(),
    );
  });

  it('should throw an error when user is not a member of the organization', async () => {
    (
      organizationMembershipService.findByOrganizationIdAndUserId as jest.Mock
    ).mockResolvedValue(null);

    const dto = new CreateQuizDTO();
    dto.organizationId = randomUUID();
    dto.question = faker.lorem.sentence();
    dto.answer = faker.lorem.sentence();
    dto.wrongAnswers = [faker.lorem.sentence(), faker.lorem.sentence()];

    await expect(quizService.createQuiz(dto)).rejects.toThrow(
      new UserNotMemberOfOrganizationError(),
    );
  });
});
