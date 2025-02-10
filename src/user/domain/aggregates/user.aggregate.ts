import {
  USER_CREATED_DOMAIN_EVENT,
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../../../user/application/events/user-created.event';
import { Membership } from '../entities/membership.entity';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.value-object';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../value-objects/organization-type.value-object';

export class UserAggregate {
  private domainEvents: USER_CREATED_DOMAIN_EVENT[] = [];
  private defaultOrganization: Organization;
  private defaultOrganizationMembership: Membership;

  constructor(private readonly user: User) {}

  static createUser(emailAddress: string) {
    const email = new Email(emailAddress);
    const user = new User(email);
    const userAggregate = new UserAggregate(user);
    userAggregate.domainEvents.push({
      name: USER_CREATED_EVENT,
      data: new UserCreatedEvent(user.id, user.getEmail()),
    });

    return userAggregate;
  }

  getUser() {
    return this.user;
  }

  getUserEmail() {
    return this.user.getEmail();
  }

  getUserId() {
    return this.user.id;
  }

  getDomainEvents() {
    return this.domainEvents;
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }

  createDefaultOrganization() {
    const defaultOrganization = new Organization(
      new OrganizationType(ORGANIZATION_TYPES.SINGLE),
      this.user,
    );
    const organizationMembership = new Membership(
      this.user,
      defaultOrganization,
    );

    this.defaultOrganization = defaultOrganization;
    this.defaultOrganizationMembership = organizationMembership;
  }

  getDefaultOrganization() {
    return this.defaultOrganization;
  }

  getDefaultOrganizationMembership() {
    return this.defaultOrganizationMembership;
  }
}
