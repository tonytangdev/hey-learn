import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../../../../../application/repositories/organization.repository';
import { Organization } from '../../../../../domain/entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationRelationalRepository
  implements OrganizationRepository
{
  constructor(
    @InjectRepository(OrganizationRelationalEntity)
    private readonly organizationRelationalEntity: Repository<OrganizationRelationalEntity>,
  ) {}

  async findById(id: Organization['id']): Promise<Organization | null> {
    const organization = await this.organizationRelationalEntity.findOneBy({
      id,
    });
    if (!organization) {
      return null;
    }

    return new Organization(organization.id);
  }
}
