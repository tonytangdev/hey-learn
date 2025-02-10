import {
  USER_CREATED_DOMAIN_EVENT,
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../../../user/application/events/user-created.event';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.value-object';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../value-objects/organization-type.value-object';

export class UserAggregate {
  private domainEvents: USER_CREATED_DOMAIN_EVENT[] = [];

  constructor(public readonly user: User) {}

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
    this.user.addOrganization(defaultOrganization);
  }
}
