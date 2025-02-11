import { Organization } from './organization.entity';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { ORGANIZATION_TYPES } from '../value-objects/organization-type.value-object';
import { UserEntityBuilder } from '../entities-builders/user.entity-builder';

describe('OrganizationEntity', () => {
  const organizationTypes = Object.keys(
    ORGANIZATION_TYPES,
  ) as ORGANIZATION_TYPES[];

  it.each(organizationTypes)(
    'should create an organization with type %s',
    (type) => {
      const organization = new Organization(type);
      expect(organization).toBeDefined();
      expect(organization.id).toMatch(
        /^org_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(organization.getOrganizationType()).toEqual(type);
      expect(organization.getCreatedBy()).toBeUndefined();
    },
  );

  it.each(organizationTypes)(
    'should create the organization of type %s with id, createdAt, updatedAt and deletedAt',
    (type) => {
      const user = new UserEntityBuilder()
        .withEmail(faker.internet.email())
        .build();
      const id = randomUUID();
      const organization = new Organization(
        type,
        user,
        id,
        new Date(),
        new Date(),
        new Date(),
      );
      expect(organization).toBeDefined();
      expect(organization.id).toBe(id);
      expect(organization.createdAt).toBeInstanceOf(Date);
      expect(organization.updatedAt).toBeInstanceOf(Date);
      expect(organization.deletedAt).toBeInstanceOf(Date);
    },
  );

  it('should set the createdBy', () => {
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(ORGANIZATION_TYPES.SINGLE);
    organization.setCreatedBy(user);
    expect(organization.getCreatedBy()).toEqual(user);
  });
});
