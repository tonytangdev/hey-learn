import { Email } from '../../domain/value-objects/email.value-object';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserError } from '../errors/create-user.error';
import {
  USER_CREATED_EVENT,
  UserCreatedEvent,
} from '../events/user-created.event';
import {
  EVENT_EMITTER,
  EventEmitter,
} from '../../../shared/interfaces/event-emitter';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,

    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitter,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<void> {
    try {
      const email = new Email(dto.email);
      const user = new User(email);
      const createdUser = await this.userRepository.createUser(user);
      await this.eventEmitter.emit(
        USER_CREATED_EVENT,
        new UserCreatedEvent(createdUser.id, createdUser.getEmail()),
      );
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      this.logger.error({ dto });
      throw new CreateUserError();
    }
  }
}
