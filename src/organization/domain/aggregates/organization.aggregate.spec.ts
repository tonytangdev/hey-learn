import { User } from '../../../user/domain/entities/user.entity';
import { Organization } from '../entities/organization.entity';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../value-objects/organization-type.value-object';
import { OrganizationAggregate } from './organization.aggregate';
import { Email } from '../../../user/domain/value-objects/email.value-object';
import { faker } from '@faker-js/faker/.';
import { Membership } from '../entities/membership.entity';

describe('Organization Aggregate', () => {
  it('should be defined', () => {
    const organizationType = new OrganizationType(ORGANIZATION_TYPES.GROUP);
    const organization = new Organization(organizationType);
    const organizationAggregate = new OrganizationAggregate(organization, []);
    expect(organizationAggregate).toBeDefined();
  });

  it('should get organization', () => {
    const organizationType = new OrganizationType(ORGANIZATION_TYPES.GROUP);
    const organization = new Organization(organizationType);
    const organizationAggregate = new OrganizationAggregate(organization, []);
    expect(organizationAggregate.organization).toEqual(organization);
  });

  it('should get members', () => {
    const organizationType = new OrganizationType(ORGANIZATION_TYPES.GROUP);
    const organization = new Organization(organizationType);

    const user1 = new User(new Email(faker.internet.email()));
    const user1Membership = new Membership(user1, organization);
    const user2 = new User(new Email(faker.internet.email()));
    const user2Membership = new Membership(user2, organization);
    const members = [user1Membership, user2Membership];

    const organizationAggregate = new OrganizationAggregate(
      organization,
      members,
    );
    expect(organizationAggregate.organization).toEqual(organization);
    expect(organizationAggregate.members).toEqual(members);
  });

  it('should add a member', () => {
    const organizationType = new OrganizationType(ORGANIZATION_TYPES.GROUP);
    const organization = new Organization(organizationType);
    const user = new User(new Email(faker.internet.email()));
    const organizationAggregate = new OrganizationAggregate(organization, []);
    organizationAggregate.addMember(user);

    expect(organizationAggregate.members.length).toEqual(1);
    expect(organizationAggregate.members[0].user).toEqual(user);
    expect(organizationAggregate.members[0].organization).toEqual(organization);
  });
});
