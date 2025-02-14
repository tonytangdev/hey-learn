import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMembershipRepository } from '../../../../../application/repositories/organization-membership.repository';
import { OrganizationMembership } from '../../../../../domain/entities/organization-membership.entity';
import { Repository } from 'typeorm';
import { OrganizationMembershipRelationalEntity } from '../entities/organization-membership.relational-entity';

@Injectable()
export class OrganizationMembershipRelationalRepository
  implements OrganizationMembershipRepository
{
  constructor(
    @InjectRepository(OrganizationMembershipRelationalEntity)
    private readonly repository: Repository<OrganizationMembershipRelationalEntity>,
  ) {}

  async findByOrganizationIdAndUserId(
    organizationId: OrganizationMembership['organizationId'],
    userId: OrganizationMembership['userId'],
  ): Promise<OrganizationMembership | null> {
    const organizationMembership = await this.repository.findOne({
      where: {
        organizationId,
        userId,
      },
    });

    if (!organizationMembership) {
      return null;
    }

    return new OrganizationMembership(
      organizationMembership.id,
      organizationMembership.organizationId,
      organizationMembership.userId,
    );
  }
}
