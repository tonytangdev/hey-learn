import { Email } from '../../../user/domain/value-objects/email.value-object';
import { Membership } from './membership.entity';
import { faker } from '@faker-js/faker';
import { User } from '../../../user/domain/entities/user.entity';
import { Organization } from './organization.entity';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../value-objects/organization-type.value-object';
import { randomUUID } from 'node:crypto';

describe('Membership', () => {
  it('should be defined', () => {
    const email = new Email(faker.internet.email());
    const user = new User(email);
    const organizationType = new OrganizationType(ORGANIZATION_TYPES.SINGLE);
    const organization = new Organization(organizationType);
    const membership = new Membership(user, organization);

    expect(membership).toBeDefined();
    expect(membership).toBeInstanceOf(Membership);
    expect(membership.id).toMatch(
      /^memb_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(membership.createdAt).toBeInstanceOf(Date);
    expect(membership.updatedAt).toBeInstanceOf(Date);
    expect(membership.user).toBeInstanceOf(User);
    expect(membership.organization).toBeInstanceOf(Organization);
  });

  it('should create a membership with all of its properties', () => {
    const email = new Email(faker.internet.email());
    const user = new User(email);
    const organizationType = new OrganizationType(ORGANIZATION_TYPES.SINGLE);
    const organization = new Organization(organizationType);
    organization.setCreatedBy(user);
    const id = randomUUID();
    const createdAt = new Date(faker.date.past().getTime());
    const updatedAt = new Date(faker.date.recent().getTime());
    const deletedAt = new Date(faker.date.future().getTime());

    const membership = new Membership(
      user,
      organization,
      id,
      createdAt,
      updatedAt,
      deletedAt,
    );

    expect(membership.id).toEqual(id);
    expect(membership.createdAt).toEqual(createdAt);
    expect(membership.updatedAt).toEqual(updatedAt);
    expect(membership.deletedAt).toEqual(deletedAt);
    expect(membership.user).toEqual(user);
    expect(membership.organization).toEqual(organization);
  });
});
