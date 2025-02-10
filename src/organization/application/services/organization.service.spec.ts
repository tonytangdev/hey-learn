import { Test } from '@nestjs/testing';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { MembershipRepository } from '../repositories/membership.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationService } from './organization.service';
import { randomUUID } from 'node:crypto';
import { Organization } from '../../..//organization/domain/entities/organization.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { Membership } from '../../../organization/domain/entities/membership.entity';
import { UserRepository } from '../repositories/user.repository';
import { Email } from '../../../user/domain/value-objects/email.value-object';
import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../errors/user-not-found';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationRepository: OrganizationRepository;
  let membershipRepository: MembershipRepository;
  let userRepository: UserRepository;
  let transactionManager: TransactionManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: OrganizationRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: MembershipRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest
              .fn()
              .mockResolvedValue(new User(new Email(faker.internet.email()))),
          },
        },
        {
          provide: TRANSACTION_MANAGER,
          useValue: {
            execute: jest.fn((fn: Function) => fn()),
          },
        },
      ],
    }).compile();

    organizationService =
      moduleRef.get<OrganizationService>(OrganizationService);
    organizationRepository = moduleRef.get<OrganizationRepository>(
      OrganizationRepository,
    );
    membershipRepository =
      moduleRef.get<MembershipRepository>(MembershipRepository);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    transactionManager = moduleRef.get<TransactionManager>(TRANSACTION_MANAGER);
  });

  it('should be defined', () => {
    expect(organizationService).toBeDefined();
  });

  it('should create the default organization', async () => {
    const userId = randomUUID();

    await organizationService.createDefaultOrganization(userId);
    expect(transactionManager.execute).toHaveBeenCalled();
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(organizationRepository.create).toHaveBeenCalledWith(
      expect.any(Organization),
      undefined,
    );
    expect(membershipRepository.create).toHaveBeenCalledWith(
      expect.any(Membership),
      undefined,
    );
  });

  it('should throw an error when organization already exists', () => {
    const userId = randomUUID();
    (userRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    expect(
      organizationService.createDefaultOrganization(userId),
    ).rejects.toThrow(UserNotFoundError);
  });
});
