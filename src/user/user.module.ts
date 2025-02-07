import { Module } from '@nestjs/common';
import { UserController } from './application/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { CreateUserCommandHandler } from './application/handlers/commands/create-user-command.handler';
import { UserRepository } from './application/repositories/user.repository';
import { UserInMemoryRepository } from './infrastructure/repositories/in-memory/user.in-memory.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserCommandHandler,
    {
      provide: UserRepository,
      useClass: UserInMemoryRepository,
    },
  ],
  exports: [],
})
export class UserModule {}
