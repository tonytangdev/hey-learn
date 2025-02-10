import { faker } from '@faker-js/faker';
import {
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../../../user/application/events/user-created.event';
import { UserAggregate } from './user.aggregate';
import { Organization } from '../entities/organization.entity';
import { Membership } from '../entities/membership.entity';

describe('UserAggregate', () => {
  it('should create a user', () => {
    const emailAddress = faker.internet.email();
    const userAggregate = UserAggregate.createUser(emailAddress);
    expect(userAggregate.getUserEmail()).toEqual(emailAddress);
    expect(userAggregate.getUserId()).toBeDefined();
  });

  it('should get domain events', () => {
    const emailAddress = faker.internet.email();
    const userAggregate = UserAggregate.createUser(emailAddress);
    expect(userAggregate.getDomainEvents()).toHaveLength(1);
    expect(userAggregate.getDomainEvents()[0].name).toEqual(USER_CREATED_EVENT);
    expect(userAggregate.getDomainEvents()[0].data).toEqual(
      new UserCreatedEvent(expect.any(String), emailAddress),
    );
  });

  it('should clear domain events', () => {
    const emailAddress = faker.internet.email();
    const userAggregate = UserAggregate.createUser(emailAddress);
    userAggregate.clearDomainEvents();
    expect(userAggregate.getDomainEvents()).toHaveLength(0);
  });

  it('should create default organization and membership', () => {
    const emailAddress = faker.internet.email();
    const userAggregate = UserAggregate.createUser(emailAddress);
    userAggregate.createDefaultOrganization();
    expect(userAggregate.getDefaultOrganization()).toBeInstanceOf(Organization);
    expect(userAggregate.getDefaultOrganizationMembership()).toBeInstanceOf(
      Membership,
    );
  });
});
