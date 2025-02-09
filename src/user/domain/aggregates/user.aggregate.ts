import {
  USER_CREATED_DOMAIN_EVENT,
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../../../user/application/events/user-created.event';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.value-object';

export class UserAggregate {
  private domainEvents: USER_CREATED_DOMAIN_EVENT[] = [];

  constructor(public readonly user: User) {}

  static createUser(email: Email) {
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
  getUser() {
    return this.user;
  }
}
