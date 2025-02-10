import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../user/domain/entities/user.entity';
import { OrganizationRepository } from '../repositories/organization.repository';
import { MembershipRepository } from '../repositories/membership.repository';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from '../../../shared/interfaces/transaction-manager';
import { OrganizationAggregate } from '../../../organization/domain/aggregates/organization.aggregate';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../../../organization/domain/value-objects/organization-type.value-object';
import { UserRepository } from '../repositories/user.repository';
import { UserNotFoundError } from '../errors/user-not-found';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(OrganizationRepository)
    private readonly organizationRepository: OrganizationRepository,
    @Inject(MembershipRepository)
    private readonly membershipRepository: MembershipRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async createDefaultOrganization(userId: User['id']) {
    await this.transactionManager.execute(async (context) => {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundError(userId);
      }

      const organizationAggregate = OrganizationAggregate.createOrganization(
        new OrganizationType(ORGANIZATION_TYPES.SINGLE),
        user,
      );
      organizationAggregate.addMember(user);

      await this.organizationRepository.create(
        organizationAggregate.organization,
        context,
      );

      await Promise.all(
        organizationAggregate.members.map((member) =>
          this.membershipRepository.create(member, context),
        ),
      );
    });
  }
}
