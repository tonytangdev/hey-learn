import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationRepository } from 'src/user/application/repositories/organization.repository';
import { Organization } from 'src/user/domain/entities/organization.entity';
import { Repository } from 'typeorm';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { OrganizationMapper } from '../mappers/organization.mapper';

@Injectable()
export class OrganizationRelationalRepository
  implements OrganizationRepository
{
  constructor(
    @InjectRepository(OrganizationRelationalEntity)
    private readonly organizationRepository: Repository<OrganizationRelationalEntity>,
  ) {}
  async create(organization: Organization): Promise<Organization> {
    const organizationEntity = OrganizationMapper.toRelational(organization);
    const newOrganization =
      await this.organizationRepository.save(organizationEntity);
    return OrganizationMapper.toDomain(newOrganization);
  }
}
