import { Module } from '@nestjs/common';
import { QuizController } from './application/controllers/quiz.controller';
import { CreateQuizCommandHandler } from './application/handlers/commands/create-quiz-command.handler';
import { QuizService } from './application/services/quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionRelationalEntity } from './infrastructure/repositories/relational/entities/question.relational-entity';
import { AnswerRelationalEntity } from './infrastructure/repositories/relational/entities/answer.relational-entity';
import { QuestionRepository } from './application/repositories/question.repository';
import { QuestionRelationalRepository } from './infrastructure/repositories/relational/repositories/question.relational.repository';
import { TRANSACTION_MANAGER } from '../shared/interfaces/transaction-manager';
import { TransactionManagerTypeORM } from './infrastructure/transaction-managers/transaction-manager.typeorm';
import { UserModule } from '../user/user.module';
import { LLM } from './application/llm/llm';
import { LLMService } from './application/services/llm.service';
import { GenerateQuizCommandHandler } from './application/handlers/commands/generate-quiz-command.handler';
import { OpenAiLLM } from './infrastructure/llm/open-ai.llm';

@Module({
  controllers: [QuizController],
  providers: [
    CreateQuizCommandHandler,
    GenerateQuizCommandHandler,
    QuizService,
    LLMService,
    {
      provide: QuestionRepository,
      useClass: QuestionRelationalRepository,
    },
    {
      provide: TRANSACTION_MANAGER,
      useClass: TransactionManagerTypeORM,
    },
    {
      provide: LLM,
      useClass: OpenAiLLM,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([
      QuestionRelationalEntity,
      AnswerRelationalEntity,
    ]),
    UserModule,
  ],
  exports: [],
})
export class QuizModule {}
