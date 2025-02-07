import { Injectable } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { CreateUserDTO } from '../../dtos/create-user.dto';
import { Handler } from 'src/shared/interfaces/handler';

@Injectable()
export class CreateUserCommandHandler implements Handler<CreateUserDTO> {
  constructor(private readonly userService: UserService) {}

  async handle(dto: CreateUserDTO) {
    await this.userService.createUser(dto);
  }
}
