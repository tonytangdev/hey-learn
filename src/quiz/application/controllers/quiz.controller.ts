import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { CreateQuizCommandHandler } from '../handlers/commands/create-quiz-command.handler';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { Response } from 'express';
import { OrganizationNotFoundError } from '../errors/organization-not-found.error';
import { UserNotMemberOfOrganizationError } from '../errors/user-not-member-of-organization.error';

@Controller('quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

  constructor(
    private readonly createQuizCommandHandler: CreateQuizCommandHandler,
  ) {}

  @Post()
  async create(@Body() dto: CreateQuizDTO, @Res() res: Response) {
    try {
      await this.createQuizCommandHandler.handle(dto);
      res.status(HttpStatus.ACCEPTED).send();
    } catch (error) {
      if (
        error instanceof OrganizationNotFoundError ||
        error instanceof UserNotMemberOfOrganizationError
      ) {
        res.status(HttpStatus.BAD_REQUEST).send({
          message: `Organization or User not found`,
        });
      }

      this.logger.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    }
  }
}
