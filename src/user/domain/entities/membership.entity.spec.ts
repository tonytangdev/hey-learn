import { Membership } from './membership.entity';
import { faker } from '@faker-js/faker';
import { User } from '../../../user/domain/entities/user.entity';
import { Organization } from './organization.entity';
import { randomUUID } from 'node:crypto';
import { ORGANIZATION_TYPES } from '../value-objects/organization-type.value-object';
import { UserEntityBuilder } from '../entities-builders/user.entity-builder';

describe('Membership', () => {
  it('should be defined', () => {
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(ORGANIZATION_TYPES.SINGLE);
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
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(ORGANIZATION_TYPES.SINGLE);
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
