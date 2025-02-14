import { Module } from '@nestjs/common';
import { QuizController } from './application/controllers/quiz.controller';
import { CreateQuizCommandHandler } from './application/handlers/commands/create-quiz-command.handler';
import { QuizService } from './application/services/quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionRelationalEntity } from './infrastructure/infrastructure/repositories/relational/entities/question.relational-entity';
import { AnswerRelationalEntity } from './infrastructure/infrastructure/repositories/relational/entities/answer.relational-entity';
import { OrganizationRelationalEntity } from './infrastructure/infrastructure/repositories/relational/entities/organization.relational-entity';
import { AnswerRepository } from './application/repositories/answer.repository';
import { AnswerRelationalRepository } from './infrastructure/infrastructure/repositories/relational/repositories/answer.relational.repository';
import { OrganizationRepository } from './application/repositories/organization.repository';
import { OrganizationRelationalRepository } from './infrastructure/infrastructure/repositories/relational/repositories/organization.relational.repository';
import { QuestionRepository } from './application/repositories/question.repository';
import { QuestionRelationalRepository } from './infrastructure/infrastructure/repositories/relational/repositories/question.relational.repository';
import { OrganizationMembershipRepository } from './application/repositories/organization-membership.repository';
import { OrganizationMembershipRelationalRepository } from './infrastructure/infrastructure/repositories/relational/repositories/organization-membership.relational.repository';

@Module({
  controllers: [QuizController],
  providers: [
    CreateQuizCommandHandler,
    QuizService,
    {
      provide: AnswerRepository,
      useClass: AnswerRelationalRepository,
    },
    {
      provide: OrganizationRepository,
      useClass: OrganizationRelationalRepository,
    },
    {
      provide: QuestionRepository,
      useClass: QuestionRelationalRepository,
    },
    {
      provide: OrganizationMembershipRepository,
      useClass: OrganizationMembershipRelationalRepository,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([
      QuestionRelationalEntity,
      AnswerRelationalEntity,
      OrganizationRelationalEntity,
    ]),
  ],
  exports: [],
})
export class QuizModule {}
