import { randomUUID } from 'node:crypto';
import { OrganizationMembershipRelationalEntity } from '../entities/organization-membership.relational-entity';
import { faker } from '@faker-js/faker/.';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { OrganizationMembershipMapper } from './organization-membership.mapper';
import { User } from '../../../../../user/domain/entities/user.entity';
import { Email } from '../../../../../user/domain/value-objects/email.value-object';
import { Organization } from '../../../../../user/domain/entities/organization.entity';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../../../../../user/domain/value-objects/organization-type.value-object';
import { Membership } from '../../../../../user/domain/entities/membership.entity';

describe('OrganizationMembershipMapper', () => {
  it('should return domain entity', () => {
    const entity = new OrganizationMembershipRelationalEntity();
    entity.id = randomUUID();
    entity.createdAt = faker.date.past();
    entity.updatedAt = faker.date.recent();
    entity.deletedAt = null;

    const userEntity = new UserRelationalEntity();
    userEntity.id = randomUUID();
    userEntity.createdAt = faker.date.past();
    userEntity.updatedAt = faker.date.recent();
    userEntity.deletedAt = null;
    userEntity.email = faker.internet.email();

    const organizationEntity = new OrganizationRelationalEntity();
    organizationEntity.id = randomUUID();
    organizationEntity.createdAt = faker.date.past();
    organizationEntity.updatedAt = faker.date.recent();
    organizationEntity.deletedAt = null;
    const createdBy = new UserRelationalEntity();
    createdBy.id = randomUUID();
    createdBy.createdAt = faker.date.past();
    createdBy.updatedAt = faker.date.recent();
    createdBy.deletedAt = null;
    createdBy.email = faker.internet.email();
    organizationEntity.createdBy = createdBy;

    entity.user = userEntity;
    entity.organization = organizationEntity;

    const result = OrganizationMembershipMapper.toDomain(entity);
    expect(result.id).toEqual(entity.id);
    expect(result.createdAt).toEqual(entity.createdAt);
    expect(result.updatedAt).toEqual(entity.updatedAt);
    expect(result.deletedAt).toEqual(undefined);
    expect(result.user.id).toEqual(userEntity.id);
    expect(result.user.createdAt).toEqual(userEntity.createdAt);
    expect(result.user.updatedAt).toEqual(userEntity.updatedAt);
    expect(result.user.deletedAt).toEqual(undefined);
    expect(result.user.getEmail()).toEqual(userEntity.email);
    expect(result.organization.id).toEqual(organizationEntity.id);
    expect(result.organization.createdAt).toEqual(organizationEntity.createdAt);
    expect(result.organization.updatedAt).toEqual(organizationEntity.updatedAt);
    expect(result.organization.deletedAt).toEqual(undefined);
  });

  it('should map to relational entity', () => {
    const user = new User(new Email(faker.internet.email()));
    const createdBy = new User(new Email(faker.internet.email()));
    const organization = new Organization(
      new OrganizationType(ORGANIZATION_TYPES.SINGLE),
      createdBy,
    );
    const membership = new Membership(user, organization);

    const result = OrganizationMembershipMapper.toPersistence(membership);
    expect(result.id).toEqual(membership.id);
    expect(result.createdAt).toEqual(membership.createdAt);
    expect(result.updatedAt).toEqual(membership.updatedAt);
    expect(result.deletedAt).toEqual(null);
    expect(result.user.id).toEqual(user.id);
    expect(result.user.createdAt).toEqual(user.createdAt);
    expect(result.user.updatedAt).toEqual(user.updatedAt);
    expect(result.user.deletedAt).toEqual(null);
    expect(result.user.email).toEqual(user.getEmail());
    expect(result.organization.id).toEqual(organization.id);
    expect(result.organization.createdAt).toEqual(organization.createdAt);
    expect(result.organization.updatedAt).toEqual(organization.updatedAt);
    expect(result.organization.deletedAt).toEqual(null);
  });
});
