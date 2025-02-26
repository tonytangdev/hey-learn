import { Injectable, Logger } from '@nestjs/common';
import { QuizService } from '../../services/quiz.service';
import { GenerateQuizDTO } from '../../dtos/generate-quiz.dto';
import { LLMService } from '../../services/llm.service';
import { OrganizationMembershipService } from '../../../../user/application/services/organization-membership.service';
import { UserHasNoDefaultOrganization } from '../../errors/user-has-no-default-organization';

@Injectable()
export class GenerateQuizCommandHandler {
  private readonly logger = new Logger(GenerateQuizCommandHandler.name);

  constructor(
    private readonly quizService: QuizService,
    private readonly llmService: LLMService,
    private readonly organizationMembershipService: OrganizationMembershipService,
  ) {}

  async handle(dto: GenerateQuizDTO): Promise<void> {
    try {
      if (!dto.organizationId) {
        const organizationMembership =
          await this.organizationMembershipService.findDefaultOrganizationByUserId(
            dto.userId,
          );

        if (!organizationMembership) {
          throw new UserHasNoDefaultOrganization(dto.userId);
        }

        dto.organizationId = organizationMembership.organization.id;
      }

      const quizzesToCreate = await this.llmService.generateQuiz(dto.textInput);
      await Promise.all(
        quizzesToCreate.map(async (quizToCreate) => {
          await this.quizService.createQuiz({
            ...quizToCreate,
            userId: dto.userId,
            organizationId: dto.organizationId!,
          });
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
