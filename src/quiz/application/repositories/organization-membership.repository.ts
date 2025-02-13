import { OrganizationMembership } from '../../domain/entities/organization-membership.entity';

export abstract class OrganizationMembershipRepository {
  abstract findByOrganizationIdAndUserId(
    organizationId: OrganizationMembership['organizationId'],
    userId: OrganizationMembership['userId'],
  ): Promise<OrganizationMembership | null>;
}
