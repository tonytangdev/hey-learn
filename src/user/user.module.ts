import { Module } from '@nestjs/common';
import { UserController } from './application/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { CreateUserCommandHandler } from './application/handlers/commands/create-user-command.handler';
import { UserRepository } from './application/repositories/user.repository';
import { UserInMemoryRepository } from './infrastructure/repositories/in-memory/user.in-memory.repository';
import { EVENT_EMITTER } from '../shared/interfaces/event-emitter';
import { EventEmitterDefault } from './infrastructure/event-emitters/event-emitter.default';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserCommandHandler,
    {
      provide: UserRepository,
      useClass: UserInMemoryRepository,
    },
    {
      provide: EVENT_EMITTER,
      useClass: EventEmitterDefault,
    },
  ],
  exports: [],
})
export class UserModule {}
