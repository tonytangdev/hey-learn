import { User } from '../../domain/entities/user.entity';
import { Membership } from '../../domain/entities/membership.entity';

export abstract class OrganizationMembershipRepository {
  abstract create(membership: Membership): Promise<Membership>;
  abstract findByOrganizationIdAndUserId(
    organizationId: Membership['organization']['id'],
    userId: Membership['user']['id'],
  ): Promise<Membership | null>;
  abstract findDefaultOrganizationByUserId(
    userId: User['id'],
  ): Promise<Membership | null>;
}
