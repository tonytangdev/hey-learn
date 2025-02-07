import { Email } from '../../domain/value-objects/email.value-object';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserError } from '../errors/create-user.error';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../events/user-created.event';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<void> {
    try {
      const email = new Email(dto.email);
      const user = new User(email);
      const createdUser = await this.userRepository.createUser(user);
      this.eventEmitter.emit(
        USER_CREATED_EVENT,
        new UserCreatedEvent(createdUser.id, createdUser.getEmail()),
      );
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      throw new CreateUserError();
    }
  }
}
