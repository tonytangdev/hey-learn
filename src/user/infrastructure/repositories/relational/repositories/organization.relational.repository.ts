import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationRepository } from 'src/user/application/repositories/organization.repository';
import { Organization } from 'src/user/domain/entities/organization.entity';
import { Repository, EntityManager } from 'typeorm';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { OrganizationMapper } from '../mappers/organization.mapper';

@Injectable()
export class OrganizationRelationalRepository
  implements OrganizationRepository
{
  constructor(
    @InjectRepository(OrganizationRelationalEntity)
    private readonly organizationRepository: Repository<OrganizationRelationalEntity>,
  ) {}
  async create(
    organization: Organization,
    context?: EntityManager,
  ): Promise<Organization> {
    const em = context ?? this.organizationRepository.manager;

    const organizationEntity = OrganizationMapper.toRelational(organization);

    const newOrganization = await em.save(organizationEntity);

    return OrganizationMapper.toDomain(newOrganization);
  }
}
