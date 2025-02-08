import { faker } from '@faker-js/faker';

import { User } from '../../domain/entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';
import { CreateUserError } from '../errors/create-user.error';
import {
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../events/user-created.event';
import { Email } from '../../domain/value-objects/email.value-object';
import { randomUUID } from 'node:crypto';
import {
  EVENT_EMITTER,
  EventEmitter,
} from '../../../shared/interfaces/event-emitter';
import { UserAlreadyExists } from '../errors/user-already-exists.error';
import { Test } from '@nestjs/testing';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let eventEmitter: EventEmitter;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        { provide: EVENT_EMITTER, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    eventEmitter = moduleRef.get<EventEmitter>(EVENT_EMITTER);
  });

  it('should create a user', async () => {
    const newUser = new CreateUserDTO();
    newUser.email = faker.internet.email();

    const mockEmail = new Email(faker.internet.email());
    const mockId = randomUUID();
    const mockUser = new User(mockEmail, mockId);
    (userRepository.createUser as jest.Mock).mockResolvedValue(mockUser);

    await userService.createUser(newUser);
    expect(userRepository.createUser).toHaveBeenCalledWith(expect.any(User));
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      USER_CREATED_EVENT,
      new UserCreatedEvent(mockId, mockUser.getEmail()),
    );
  });

  it('should throw an error if user creation fails', async () => {
    const newUser = new CreateUserDTO();
    newUser.email = faker.internet.email();
    (userRepository.createUser as jest.Mock).mockRejectedValueOnce(new Error());
    await expect(userService.createUser(newUser)).rejects.toThrow(
      new CreateUserError(),
    );
  });

  it('should throw an error if user already exists', async () => {
    const newUser = new CreateUserDTO();
    newUser.email = faker.internet.email();
    (userRepository.findByEmail as jest.Mock).mockResolvedValueOnce(
      new User(new Email(newUser.email)),
    );
    await expect(userService.createUser(newUser)).rejects.toThrow(
      new UserAlreadyExists(newUser.email),
    );
  });
});
