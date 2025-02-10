import { Membership } from '../../../organization/domain/entities/membership.entity';

export abstract class MembershipRepository {
  abstract create(membership: Membership, context?: any): Promise<Membership>;
}
