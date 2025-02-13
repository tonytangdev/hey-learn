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
import { Organization } from '../../domain/entities/organization.entity';
import { Question } from '../../domain/entities/question.entity';
import { Answer } from '../../domain/entities/answer.entity';

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

    if (await this.organizationNotFound(organizationId)) {
      throw new OrganizationNotFoundError(organizationId);
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

  private async organizationNotFound(organizationId: string) {
    const organization =
      await this.organizationRepository.findById(organizationId);
    return !organization;
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
