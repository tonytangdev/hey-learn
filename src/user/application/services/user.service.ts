import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserError } from '../errors/create-user.error';
import {
  EVENT_EMITTER,
  EventEmitter,
} from '../../../shared/interfaces/event-emitter';
import { UserAlreadyExists } from '../errors/user-already-exists.error';
import { UserAggregate } from '../../../user/domain/aggregates/user.aggregate';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationMembershipRepository } from '../repositories/organization-membership.repository';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationMembershipRepo: OrganizationMembershipRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitter,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExists(dto.email);
    }

    const userAggregate = UserAggregate.createUser(dto.email);
    userAggregate.createDefaultOrganization();

    try {
      await this.transactionManager.execute(async (transaction) => {
        const userRepository = transaction.getRepository(this.userRepository);
        await userRepository.createUser(userAggregate.getUser());

        const organizationRepository = transaction.getRepository(
          this.organizationRepository,
        );
        await organizationRepository.create(
          userAggregate.getDefaultOrganization(),
        );

        const organizationMembershipRepo = transaction.getRepository(
          this.organizationMembershipRepo,
        );
        await organizationMembershipRepo.create(
          userAggregate.getDefaultOrganizationMembership(),
        );
      });
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      this.logger.error({ dto });
      throw new CreateUserError();
    }

    await Promise.all(
      userAggregate
        .getDomainEvents()
        .map(
          async (event) => await this.eventEmitter.emit(event.name, event.data),
        ),
    );
  }
}
