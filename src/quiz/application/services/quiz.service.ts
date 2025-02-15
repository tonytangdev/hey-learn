import { Inject, Injectable, Logger } from '@nestjs/common';
import { QuestionRepository } from '../repositories/question.repository';
import { AnswerRepository } from '../repositories/answer.repository';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { QuestionAggregate } from '../../domain/aggregates/question.aggregate';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { CreateQuizError } from '../errors/create-quiz.error';
import { Organization } from '../../domain/entities/organization.entity';
import { Question } from '../../domain/entities/question.entity';
import { Answer } from '../../domain/entities/answer.entity';
import { UserNotMemberOfOrganizationError } from '../errors/user-not-member-of-organization.error';
import { Membership } from '../../../user/domain/entities/membership.entity';
import { OrganizationMembershipService } from '../../../user/application/services/organization.service';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly answerRepository: AnswerRepository,

    private readonly organizationMembershipService: OrganizationMembershipService,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async createQuiz(dto: CreateQuizDTO) {
    const { question, answer, wrongAnswers, category, organizationId, userId } =
      dto;

    if (await this.userIsNotMemberOfOrganization(organizationId, userId)) {
      throw new UserNotMemberOfOrganizationError();
    }

    const { quizQuestion, propositions } = this.prepareQuizData(
      question,
      answer,
      wrongAnswers,
      organizationId,
      category,
    );

    try {
      await this.saveDataInDatabase(quizQuestion, propositions);
    } catch (error) {
      this.logger.error(error);
      this.logger.error({ dto });
      throw new CreateQuizError();
    }
  }

  private async userIsNotMemberOfOrganization(
    organizationId: Membership['organization']['id'],
    userId: Membership['user']['id'],
  ) {
    const membership =
      await this.organizationMembershipService.findByOrganizationIdAndUserId(
        organizationId,
        userId,
      );

    return !membership;
  }

  private prepareQuizData(
    question: string,
    answer: string,
    wrongAnswers: string[],
    organizationId: Organization['id'],
    category?: string,
  ) {
    const questionAgg = QuestionAggregate.create(
      question,
      answer,
      wrongAnswers,
      organizationId,
      category,
    );

    return {
      quizQuestion: questionAgg.getQuestion(),
      propositions: questionAgg.getPropositions(),
      organizationId,
    };
  }

  private async saveDataInDatabase(question: Question, propositions: Answer[]) {
    await this.transactionManager.execute(async (transaction) => {
      const questionRepository = transaction.getRepository(
        this.questionRepository,
      );
      await questionRepository.save(question);

      const answerRepository = transaction.getRepository(this.answerRepository);

      await Promise.all(
        propositions.map(async (proposition) => {
          await answerRepository.save(proposition);
        }),
      );
    });
  }
}
