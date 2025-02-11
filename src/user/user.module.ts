import { Module } from '@nestjs/common';
import { UserController } from './application/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { CreateUserCommandHandler } from './application/handlers/commands/create-user-command.handler';
import { UserRepository } from './application/repositories/user.repository';
import { EVENT_EMITTER } from '../shared/interfaces/event-emitter';
import { EventEmitterDefault } from './infrastructure/event-emitters/event-emitter.default';
import { UserRelationalRepository } from './infrastructure/repositories/relational/repositories/user.relational.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelationalEntity } from './infrastructure/repositories/relational/entities/user.relational-entity';
import { OrganizationRepository } from './application/repositories/organization.repository';
import { OrganizationRelationalRepository } from './infrastructure/repositories/relational/repositories/organization.relational.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserCommandHandler,
    {
      provide: UserRepository,
      useClass: UserRelationalRepository,
    },
    {
      provide: OrganizationRepository,
      useClass: OrganizationRelationalRepository,
    },
    {
      provide: EVENT_EMITTER,
      useClass: EventEmitterDefault,
    },
  ],
  imports: [TypeOrmModule.forFeature([UserRelationalEntity])],
  exports: [],
})
export class UserModule {}
