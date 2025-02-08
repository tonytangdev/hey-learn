import { User } from '../../../user/domain/entities/user.entity';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../value-objects/organization-type.value-object';
import { Organization } from './organization.entity';
import { Email } from '../../../user/domain/value-objects/email.value-object';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';

describe('OrganizationEntity', () => {
  const organizationTypes = Object.keys(
    ORGANIZATION_TYPES,
  ) as ORGANIZATION_TYPES[];

  it.each(organizationTypes)(
    'should create an organization with type %s',
    (type) => {
      const organizationType = new OrganizationType(type);
      const organization = new Organization(organizationType);
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
      const organizationType = new OrganizationType(type);
      const email = new Email(faker.internet.email());
      const user = new User(email);
      const id = randomUUID();
      const organization = new Organization(
        organizationType,
        id,
        new Date(),
        new Date(),
        user,
        new Date(),
      );
      expect(organization).toBeDefined();
      expect(organization.id).toBe(id);
      expect(organization.createdAt).toBeInstanceOf(Date);
      expect(organization.updatedAt).toBeInstanceOf(Date);
      expect(organization.deletedAt).toBeInstanceOf(Date);
    },
  );
});
