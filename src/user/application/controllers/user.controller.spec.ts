import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserCommandHandler } from '../handlers/commands/create-user-command.handler';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { faker } from '@faker-js/faker';
import { Response } from 'express';
import { UserAlreadyExists } from '../errors/user-already-exists.error';
import { HttpStatus } from '@nestjs/common';

describe('User Controller', () => {
  let userController: UserController;
  let createUserCommandHandler: CreateUserCommandHandler;
  let res: Response;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserCommandHandler,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = moduleRef.get(UserController);
    createUserCommandHandler = moduleRef.get(CreateUserCommandHandler);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const createUserDTO = new CreateUserDTO();
      createUserDTO.email = faker.internet.email();

      const handleSpy = jest
        .spyOn(createUserCommandHandler, 'handle')
        .mockResolvedValue();

      await userController.createUser(createUserDTO, res);
      expect(handleSpy).toHaveBeenCalledWith(createUserDTO);
    });

    it('should not create an existing user', async () => {
      res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const createUserDTO = new CreateUserDTO();
      createUserDTO.email = faker.internet.email();

      const handleSpy = jest
        .spyOn(createUserCommandHandler, 'handle')
        .mockRejectedValueOnce(new UserAlreadyExists(createUserDTO.email));

      await userController.createUser(createUserDTO, res);
      expect(handleSpy).toHaveBeenCalledWith(createUserDTO);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(res.send).toHaveBeenCalledWith({
        message: `User with email ${createUserDTO.email} already exists`,
      });
    });

    it('should throw an error when userService throws an error', async () => {
      res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      const createUserDTO = new CreateUserDTO();
      createUserDTO.email = faker.internet.email();

      const handleSpy = jest
        .spyOn(createUserCommandHandler, 'handle')
        .mockRejectedValueOnce(new Error());
      await userController.createUser(createUserDTO, res);
      expect(handleSpy).toHaveBeenCalledWith(createUserDTO);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
  });
});
