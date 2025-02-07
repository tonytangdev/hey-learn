import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserCommandHandler } from '../handlers/commands/create-user-command.handler';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { faker } from '@faker-js/faker';

describe('User Controller', () => {
  let userController: UserController;
  let createUserCommandHandler: CreateUserCommandHandler;

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
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDTO = new CreateUserDTO();
      createUserDTO.email = faker.internet.email();

      const handleSpy = jest
        .spyOn(createUserCommandHandler, 'handle')
        .mockResolvedValue();

      await userController.createUser(createUserDTO);
      expect(handleSpy).toHaveBeenCalledWith(createUserDTO);
    });
  });
});
