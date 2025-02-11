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

  async create(membership: Membership, context?: any): Promise<Membership> {
    const em = context ?? this.organizationMembershipRepository.manager;
    const membershipEntity =
      OrganizationMembershipMapper.toPersistence(membership);

    const result = await em.save(membershipEntity);
    return OrganizationMembershipMapper.toDomain(result);
  }
}
