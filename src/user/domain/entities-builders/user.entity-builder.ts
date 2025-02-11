import { User } from '../entities/user.entity';
import { EmailRequiredError } from '../errors/email-required.error';
import { Email } from '../value-objects/email.value-object';

export class UserEntityBuilder {
  private email: User['email'];
  private id?: User['id'];
  private createdAt?: User['createdAt'];
  private updatedAt?: User['updatedAt'];
  private deletedAt?: User['deletedAt'];

  withEmail(email: string): UserEntityBuilder {
    const emailEntity = new Email(email);
    this.email = emailEntity;
    return this;
  }
  withId(id: User['id']): UserEntityBuilder {
    this.id = id;
    return this;
  }
  withCreatedAt(createdAt: User['createdAt']): UserEntityBuilder {
    this.createdAt = createdAt;
    return this;
  }
  withUpdatedAt(updatedAt: User['updatedAt']): UserEntityBuilder {
    this.updatedAt = updatedAt;
    return this;
  }
  withDeletedAt(deletedAt: User['deletedAt']): UserEntityBuilder {
    this.deletedAt = deletedAt;
    return this;
  }
  build(): User {
    if (!this.email) {
      throw new EmailRequiredError();
    }

    return new User(
      this.email,
      this.id,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
    );
  }
}
