import { Injectable } from '@nestjs/common';
import { OrganizationMembershipRepository } from '../repositories/organization-membership.repository';

@Injectable()
export class OrganizationMembershipService {
  constructor(
    private readonly organizationMembershipRepository: OrganizationMembershipRepository,
  ) {}

  async findByOrganizationIdAndUserId(organizationId: string, userId: string) {
    return await this.organizationMembershipRepository.findByOrganizationIdAndUserId(
      organizationId,
      userId,
    );
  }

  async findDefaultOrganizationByUserId(userId: string) {
    return await this.organizationMembershipRepository.findDefaultOrganizationByUserId(
      userId,
    );
  }
}
