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
import { User } from '../../domain/entities/user.entity';
import { Organization } from '../../domain/entities/organization.entity';
import { Membership } from '../../domain/entities/membership.entity';
import { USER_CREATED_DOMAIN_EVENT } from '../events/user-created.event';

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
    if (await this.userExists(dto.email)) {
      throw new UserAlreadyExists(dto.email);
    }

    const { user, organization, membership, domainEvents } =
      this.prepareUserAndItsDefaultOrganization(dto.email);

    try {
      await this.saveDataInDatabase(user, organization, membership);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      this.logger.error({ dto });
      throw new CreateUserError();
    }

    await this.emitDomainEvents(domainEvents);
  }

  private async userExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  private prepareUserAndItsDefaultOrganization(email: string) {
    const userAggregate = UserAggregate.createUser(email);
    userAggregate.createDefaultOrganization();

    return {
      user: userAggregate.getUser(),
      organization: userAggregate.getDefaultOrganization(),
      membership: userAggregate.getDefaultOrganizationMembership(),
      domainEvents: userAggregate.getDomainEvents(),
    };
  }

  private async saveDataInDatabase(
    user: User,
    organization: Organization,
    membership: Membership,
  ) {
    await this.transactionManager.execute(async (transaction) => {
      const userRepository = transaction.getRepository(this.userRepository);
      await userRepository.createUser(user);

      const organizationRepository = transaction.getRepository(
        this.organizationRepository,
      );
      await organizationRepository.create(organization);

      const organizationMembershipRepo = transaction.getRepository(
        this.organizationMembershipRepo,
      );
      await organizationMembershipRepo.create(membership);
    });
  }

  private async emitDomainEvents(domainEvents: USER_CREATED_DOMAIN_EVENT[]) {
    await Promise.all(
      domainEvents.map(
        async (event) => await this.eventEmitter.emit(event.name, event.data),
      ),
    );
  }
}
