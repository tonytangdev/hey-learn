import { Email } from '../../domain/value-objects/email.value-object';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserError } from '../errors/create-user.error';
import {
  EVENT_EMITTER,
  EventEmitter,
} from '../../../shared/interfaces/event-emitter';
import { UserAlreadyExists } from '../errors/user-already-exists.error';
import { UserAggregate } from '../../../user/domain/aggregates/user.aggregate';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,

    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitter,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExists(dto.email);
    }

    const email = new Email(dto.email);
    const userAggregate = UserAggregate.createUser(email);

    try {
      await this.userRepository.createUser(userAggregate.getUser());

      await Promise.all(
        userAggregate
          .getDomainEvents()
          .map((event) => this.eventEmitter.emit(event.name, event.data)),
      );
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      this.logger.error({ dto });
      throw new CreateUserError();
    }
  }
}
