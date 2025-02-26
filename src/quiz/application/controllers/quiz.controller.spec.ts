import { Test } from '@nestjs/testing';
import { CreateQuizCommandHandler } from '../handlers/commands/create-quiz-command.handler';
import { QuizController } from './quiz.controller';
import { CreateQuizDTO } from '../dtos/create-quiz.dto';
import { randomUUID } from 'node:crypto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { OrganizationNotFoundError } from '../errors/organization-not-found.error';
import { UserNotMemberOfOrganizationError } from '../errors/user-not-member-of-organization.error';
import { GenerateQuizCommandHandler } from '../handlers/commands/generate-quiz-command.handler';
import { GenerateQuizDTO } from '../dtos/generate-quiz.dto';

describe('QuizController', () => {
  let controller: QuizController;
  let createQuizCommandHandler: CreateQuizCommandHandler;
  let generateQuizCommandHandler: GenerateQuizCommandHandler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: CreateQuizCommandHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: GenerateQuizCommandHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<QuizController>(QuizController);
    createQuizCommandHandler = moduleRef.get<CreateQuizCommandHandler>(
      CreateQuizCommandHandler,
    );
    generateQuizCommandHandler = moduleRef.get<GenerateQuizCommandHandler>(
      GenerateQuizCommandHandler,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw a 500 status code when an error occurs', async () => {
    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const handleSpy = jest
      .spyOn(createQuizCommandHandler, 'handle')
      .mockRejectedValueOnce(new Error());

    const dto = new CreateQuizDTO();
    await controller.create(dto, res);

    expect(handleSpy).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  it.each([
    { error: new Error(), status: HttpStatus.INTERNAL_SERVER_ERROR },
    {
      error: new OrganizationNotFoundError(randomUUID()),
      status: HttpStatus.BAD_REQUEST,
    },
    {
      error: new UserNotMemberOfOrganizationError(),
      status: HttpStatus.BAD_REQUEST,
    },
  ])('should throw an error : %s', async ({ error, status }) => {
    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const dto = new CreateQuizDTO();
    dto.organizationId = randomUUID();

    const handleSpy = jest
      .spyOn(createQuizCommandHandler, 'handle')
      .mockRejectedValueOnce(error);

    await controller.create(dto, res);

    expect(handleSpy).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.send).toHaveBeenCalled();
  });

  it('should create a quiz', async () => {
    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const dto = new CreateQuizDTO();
    await controller.create(dto, res);
    expect(createQuizCommandHandler.handle).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    expect(res.send).toHaveBeenCalled();
  });

  it('should generate a quiz', () => {
    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const dto: GenerateQuizDTO = {
      organizationId: randomUUID(),
      userId: randomUUID(),
      textInput: 'text',
    };

    controller.generate(dto, res);
    expect(generateQuizCommandHandler.handle).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    expect(res.send).toHaveBeenCalled();
  });
});
