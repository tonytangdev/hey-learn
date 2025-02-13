import { Inject, Injectable, Logger } from '@nestjs/common';
import { QuestionRepository } from '../repositories/question.repository';
import { AnswerRepository } from '../repositories/answer.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { OrganizationNotFoundError } from '../errors/organization-not-found.error';
import { QuestionAggregate } from '../../domain/aggregates/question.aggregate';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { CreateQuizError } from '../errors/create-quiz.error';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly answerRepository: AnswerRepository,
    private readonly organizationRepository: OrganizationRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async createQuiz(dto: CreateQuizDTO) {
    const { question, answer, wrongAnswers, category, organizationId } = dto;

    const organization =
      await this.organizationRepository.findById(organizationId);

    if (!organization) {
      throw new OrganizationNotFoundError(organizationId);
    }

    const questionAgg = QuestionAggregate.create(
      question,
      answer,
      wrongAnswers,
      organizationId,
      category,
    );

    try {
      await this.transactionManager.execute(async (transaction) => {
        const questionRepository = transaction.getRepository(
          this.questionRepository,
        );
        await questionRepository.save(questionAgg.getQuestion());

        const answerRepository = transaction.getRepository(
          this.answerRepository,
        );

        await Promise.all(
          questionAgg.getPropositions().map(async (proposition) => {
            await answerRepository.save(proposition);
          }),
        );
      });
    } catch (error) {
      this.logger.error(error);
      this.logger.error({ dto });
      throw new CreateQuizError();
    }
  }
}
