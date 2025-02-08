import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { CreateUserCommandHandler } from '../handlers/commands/create-user-command.handler';
import { UserAlreadyExists } from '../errors/user-already-exists.error';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserCommandHandler: CreateUserCommandHandler,
  ) {}

  @Post()
  async createUser(
    @Body() dto: CreateUserDTO,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.createUserCommandHandler.handle(dto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        res.status(HttpStatus.CONFLICT).send({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal Server Error' });
      }
    }
  }
}
