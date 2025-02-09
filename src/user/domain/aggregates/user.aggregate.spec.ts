import {
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../../../user/application/events/user-created.event';
import { Email } from '../value-objects/email.value-object';
import { UserAggregate } from './user.aggregate';

describe('UserAggregate', () => {
  it('should create a user', () => {
    const email = new Email('test@example.com');
    const userAggregate = UserAggregate.createUser(email);
    expect(userAggregate.getUser().getEmail()).toEqual(email.value);
    expect(userAggregate.getUser().id).toBeDefined();
  });

  it('should get domain events', () => {
    const email = new Email('test@example.com');
    const userAggregate = UserAggregate.createUser(email);
    expect(userAggregate.getDomainEvents()).toHaveLength(1);
    expect(userAggregate.getDomainEvents()[0].name).toEqual(USER_CREATED_EVENT);
    expect(userAggregate.getDomainEvents()[0].data).toEqual(
      new UserCreatedEvent(expect.any(String), email.value),
    );
  });

  it('should clear domain events', () => {
    const email = new Email('test@example.com');
    const userAggregate = UserAggregate.createUser(email);
    userAggregate.clearDomainEvents();
    expect(userAggregate.getDomainEvents()).toHaveLength(0);
  });
});
