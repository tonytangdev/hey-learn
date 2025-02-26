import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateQuizCommandHandler } from '../handlers/commands/create-quiz-command.handler';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { Response } from 'express';
import { OrganizationNotFoundError } from '../errors/organization-not-found.error';
import { UserNotMemberOfOrganizationError } from '../errors/user-not-member-of-organization.error';
import { GenerateQuizDTO } from '../dtos/generate-quiz.dto';
import { GenerateQuizCommandHandler } from '../handlers/commands/generate-quiz-command.handler';
import { GetRandomQuizQueryHandler } from '../handlers/queries/get-random-quiz-query.handler';

@Controller('quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

  constructor(
    private readonly createQuizCommandHandler: CreateQuizCommandHandler,
    private readonly generateQuizCommandHandler: GenerateQuizCommandHandler,
    private readonly getRandomQuizQueryHandler: GetRandomQuizQueryHandler,
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

  @Post('generate')
  async generate(@Body() dto: GenerateQuizDTO, @Res() res: Response) {
    await this.generateQuizCommandHandler.handle(dto);
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  async getRandomQuiz(@Query('userId') userId: string, @Res() res: Response) {
    const quiz = await this.getRandomQuizQueryHandler.handle(userId);
    res.status(HttpStatus.OK).send(quiz);
  }
}
