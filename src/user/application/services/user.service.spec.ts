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
import {
  EVENT_EMITTER,
  EventEmitter,
} from '../../../shared/interfaces/event-emitter';
import { UserAlreadyExists } from '../errors/user-already-exists.error';
import { Test } from '@nestjs/testing';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationMembershipRepository } from '../repositories/organization-membership.repository';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { Organization } from '../../../user/domain/entities/organization.entity';
import { Membership } from '../../../user/domain/entities/membership.entity';
import { UserEntityBuilder } from '../../../user/domain/entities-builders/user.entity-builder';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let organizationRepository: OrganizationRepository;
  let organizationMembershipRepository: OrganizationMembershipRepository;
  let transactionManager: TransactionManager;
  const context: any = {};
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
        {
          provide: OrganizationRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: OrganizationMembershipRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_MANAGER,
          useValue: {
            execute: jest.fn((fn: (context: any) => void) => fn(context)),
          },
        },
        {
          provide: EVENT_EMITTER,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    organizationRepository = moduleRef.get<OrganizationRepository>(
      OrganizationRepository,
    );
    organizationMembershipRepository =
      moduleRef.get<OrganizationMembershipRepository>(
        OrganizationMembershipRepository,
      );
    transactionManager = moduleRef.get<TransactionManager>(TRANSACTION_MANAGER);
    eventEmitter = moduleRef.get<EventEmitter>(EVENT_EMITTER);
  });

  it('should create a user', async () => {
    const newUser = new CreateUserDTO();
    newUser.email = faker.internet.email();

    await userService.createUser(newUser);
    expect(userRepository.createUser).toHaveBeenCalledWith(expect.any(User));
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      USER_CREATED_EVENT,
      new UserCreatedEvent(expect.any(String), newUser.email),
    );
  });

  it('should create the default organization and membership for the user', async () => {
    const newUser = new CreateUserDTO();
    newUser.email = faker.internet.email();
    await userService.createUser(newUser);
    expect(transactionManager.execute).toHaveBeenCalled();
    expect(organizationRepository.create).toHaveBeenCalledWith(
      expect.any(Organization),
      context,
    );
    expect(organizationMembershipRepository.create).toHaveBeenCalledWith(
      expect.any(Membership),
      context,
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
      new UserEntityBuilder().withEmail(newUser.email).build(),
    );
    await expect(userService.createUser(newUser)).rejects.toThrow(
      new UserAlreadyExists(newUser.email),
    );
  });
});
