import { Injectable } from '@nestjs/common';
import { OrganizationMembershipRepository } from '../../../../../user/application/repositories/organization-membership.repository';
import { Membership } from '../../../../../user/domain/entities/membership.entity';
import { OrganizationMembershipMapper } from '../mappers/organization-membership.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMembershipRelationalEntity } from '../entities/organization-membership.relational-entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationMembershipRelationalRepository
  implements OrganizationMembershipRepository
{
  constructor(
    @InjectRepository(OrganizationMembershipRelationalEntity)
    private readonly organizationMembershipRepository: Repository<OrganizationMembershipRelationalEntity>,
  ) {}

  async create(membership: Membership): Promise<Membership> {
    const membershipEntity =
      OrganizationMembershipMapper.toPersistence(membership);
    const result =
      await this.organizationMembershipRepository.save(membershipEntity);
    return OrganizationMembershipMapper.toDomain(result);
  }

  async findByOrganizationIdAndUserId(
    organizationId: Membership['organization']['id'],
    userId: Membership['user']['id'],
  ): Promise<Membership | null> {
    const membershipEntity =
      await this.organizationMembershipRepository.findOne({
        where: { organization: { id: organizationId }, user: { id: userId } },
      });

    return membershipEntity
      ? Promise.resolve(OrganizationMembershipMapper.toDomain(membershipEntity))
      : Promise.resolve(null);
  }
}
