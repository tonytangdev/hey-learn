import { Membership } from '../../../user/domain/entities/membership.entity';

export const OrganizationMembershipRepository = Symbol(
  'OrganizationMembershipRepository',
);

export interface findByOrganizationIdAndUserId {
  findByOrganizationIdAndUserId(
    organizationId: string,
    userId: string,
  ): Promise<Membership | null>;
}
