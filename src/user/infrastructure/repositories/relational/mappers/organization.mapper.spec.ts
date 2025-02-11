import { OrganizationMapper } from './organization.mapper';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { Organization } from '../../../../../user/domain/entities/organization.entity';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../../../../../user/domain/value-objects/organization-type.value-object';
import { User } from '../../../../../user/domain/entities/user.entity';
import { Email } from '../../../../../user/domain/value-objects/email.value-object';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';

describe('OrganizationMapper', () => {
  let organizationRelationalEntity: OrganizationRelationalEntity;
  let organization: Organization;

  beforeEach(() => {
    organizationRelationalEntity = new OrganizationRelationalEntity();
    organizationRelationalEntity.id = randomUUID();
    organizationRelationalEntity.type = ORGANIZATION_TYPES.SINGLE;
    organizationRelationalEntity.createdAt = faker.date.past();
    organizationRelationalEntity.updatedAt = faker.date.recent();
    organizationRelationalEntity.deletedAt = null;
    organizationRelationalEntity.createdBy = {
      id: randomUUID(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
    };

    const organizationType = new OrganizationType(
      organizationRelationalEntity.type,
    );
    const createdBy = new User(
      new Email(organizationRelationalEntity.createdBy.email),
      organizationRelationalEntity.createdBy.id,
      organizationRelationalEntity.createdBy.createdAt,
      organizationRelationalEntity.createdBy.updatedAt,
      organizationRelationalEntity.createdBy.deletedAt ?? undefined,
    );

    organization = new Organization(
      organizationType,
      createdBy,
      organizationRelationalEntity.id,
      organizationRelationalEntity.createdAt,
      organizationRelationalEntity.updatedAt,
      organizationRelationalEntity.deletedAt ?? undefined,
    );
  });

  it('should map to domain entity correctly', () => {
    const domainEntity = OrganizationMapper.toDomain(
      organizationRelationalEntity,
    );
    expect(domainEntity).toEqual(organization);
  });

  it('should map to relational entity correctly', () => {
    const relationalEntity = OrganizationMapper.toRelational(organization);
    expect(relationalEntity).toEqual(organizationRelationalEntity);
  });
});
