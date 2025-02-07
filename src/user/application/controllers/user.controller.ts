import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { CreateUserCommandHandler } from '../handlers/commands/create-user-command.handler';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserCommandHandler: CreateUserCommandHandler,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDTO): Promise<void> {
    await this.createUserCommandHandler.handle(dto);
  }
}
