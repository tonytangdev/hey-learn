import { Membership } from '../../domain/entities/membership.entity';

export abstract class OrganizationMembershipRepository {
  abstract create(membership: Membership): Promise<Membership>;
}
