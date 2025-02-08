import { CreateUserDTO } from '../../dtos/create-user.dto';
import { UserService } from '../../services/user.service';
import { CreateUserCommandHandler } from './create-user-command.handler';
import { faker } from '@faker-js/faker';
import { Email } from '../../../domain/value-objects/email.value-object';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../../repositories/user.repository';
import { EVENT_EMITTER } from '../../../../shared/interfaces/event-emitter';

describe('CreateUserCommandHandler', () => {
  let createUserCommandHandler: CreateUserCommandHandler;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        CreateUserCommandHandler,
        UserService,
        {
          provide: UserRepository,
          useValue: jest.fn(),
        },
        {
          provide: EVENT_EMITTER,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserCommandHandler = moduleRef.get(CreateUserCommandHandler);
    userService = moduleRef.get(UserService);
  });

  it('should create a user', async () => {
    const createUserSpy = jest
      .spyOn(userService, 'createUser')
      .mockResolvedValue();

    const createUserDTO = new CreateUserDTO();
    const email = new Email(faker.internet.email());
    createUserDTO.email = email.value;

    await createUserCommandHandler.handle(createUserDTO);
    expect(createUserSpy).toHaveBeenCalledWith(createUserDTO);
  });
});
