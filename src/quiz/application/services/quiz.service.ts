import { Inject, Injectable, Logger } from '@nestjs/common';
import { QuestionRepository } from '../repositories/question.repository';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { QuestionAggregate } from '../../domain/aggregates/question.aggregate';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { CreateQuizError } from '../errors/create-quiz.error';
import { Organization } from '../../domain/entities/organization.entity';
import { Question } from '../../domain/entities/question.entity';
import { UserNotMemberOfOrganizationError } from '../errors/user-not-member-of-organization.error';
import { Membership } from '../../../user/domain/entities/membership.entity';
import { OrganizationMembershipService } from '../../../user/application/services/organization-membership.service';
import { AnswerQuizDTO } from '../dtos/answer-quiz.dto';
import { UserAnswer } from '../../domain/entities/user-answer.entity';
import { UserAnswerRepository } from '../repositories/user-answer.repository';
import { QuestionGeneration } from '../../domain/entities/question-generation.entity';
import { QuestionGenerationRepository } from '../repositories/question-generation.repository';
import { GenerateQuizDTO } from '../dtos/generate-quiz.dto';
import { Transaction } from '../../../shared/interfaces/transaction';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(
    private readonly questionRepository: QuestionRepository,

    private readonly organizationMembershipService: OrganizationMembershipService,

    private readonly userAnswerRepository: UserAnswerRepository,

    private readonly questionGenerationRepository: QuestionGenerationRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async createQuestions(
    questions: Pick<CreateQuizDTO, 'question' | 'answer' | 'wrongAnswers'>[],
    dto: GenerateQuizDTO,
  ) {
    await this.transactionManager.execute(async (transaction) => {
      const questionGenerationRepository = transaction.getRepository(
        this.questionGenerationRepository,
      );

      const questionGeneration = new QuestionGeneration();
      await questionGenerationRepository.save(questionGeneration);

      await Promise.all(
        questions.map(async (question) => {
          const { question: text, answer, wrongAnswers } = question;

          const createQuizDTO: CreateQuizDTO = {
            question: text,
            answer,
            wrongAnswers,
            organizationId: dto.organizationId!,
            userId: dto.userId,
            questionGeneration,
          };

          await this.createQuiz(createQuizDTO, transaction);
        }),
      );
    });
  }

  async createQuiz(dto: CreateQuizDTO, transaction?: Transaction) {
    const {
      question,
      answer,
      wrongAnswers,
      category,
      organizationId,
      userId,
      questionGeneration,
    } = dto;

    if (await this.userIsNotMemberOfOrganization(organizationId, userId)) {
      throw new UserNotMemberOfOrganizationError();
    }

    const { quizQuestion } = this.prepareQuizData(
      question,
      answer,
      wrongAnswers,
      organizationId,
      questionGeneration,
      category,
    );

    try {
      await this.saveDataInDatabase(quizQuestion, transaction);
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
    questionGeneration: QuestionGeneration,
    category?: string,
  ) {
    const questionAgg = QuestionAggregate.create(
      question,
      answer,
      wrongAnswers,
      organizationId,
      questionGeneration,
      category,
    );

    return {
      quizQuestion: questionAgg.getQuestion(),
      propositions: questionAgg.getPropositions(),
      organizationId,
    };
  }

  private async saveDataInDatabase(
    question: Question,
    transaction?: Transaction,
  ) {
    if (transaction) {
      const questionRepository = transaction.getRepository(
        this.questionRepository,
      );

      await questionRepository.save(question);
      return;
    } else {
      await this.questionRepository.save(question);
    }
  }

  async getRandomQuiz(userId: string) {
    const membership =
      await this.organizationMembershipService.findDefaultOrganizationByUserId(
        userId,
      );

    if (!membership) {
      throw new UserNotMemberOfOrganizationError();
    }

    const quizQuestions = await this.getQuestionsToReturn(userId);

    const questionsFromDatabase =
      await this.questionRepository.findByIds(quizQuestions);

    return questionsFromDatabase;
  }

  private async getQuestionsToReturn(userId: string) {
    const questionsSortedByLeastAnswered =
      await this.questionRepository.findByUserIdSortedByLeastAnswered({
        userId,
      });

    // get the last 20 questions
    const questions = questionsSortedByLeastAnswered.slice(0, 20);

    // shuffle the questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    // get the first 10 questions
    const quizQuestions = shuffledQuestions.slice(0, 10);
    return quizQuestions;
  }

  async answerQuestion(dto: AnswerQuizDTO) {
    const userAnswer = new UserAnswer(dto.userId, dto.answerId);

    await this.userAnswerRepository.save(userAnswer);
  }
}
