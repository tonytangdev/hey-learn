import { faker } from '@faker-js/faker';
import { CreateUserDTO } from './create-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

describe('CreateUserDto', () => {
  it('should throw an error if no id is provided', async () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.email = faker.internet.email();
    const validationPipe = new ValidationPipe();
    await expect(
      validationPipe.transform(createUserDTO, {
        type: 'body',
        metatype: CreateUserDTO,
      }),
    ).rejects.toThrow();
  });

  it('should throw an error if email is invalid', async () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.email = faker.person.fullName();

    const validationPipe = new ValidationPipe();

    await expect(
      validationPipe.transform(createUserDTO, {
        type: 'body',
        metatype: CreateUserDTO,
      }),
    ).rejects.toThrow();
  });

  it('should not throw an error if everything is valid', async () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.id = randomUUID();
    createUserDTO.email = faker.internet.email();

    const validationPipe = new ValidationPipe();
    await expect(
      validationPipe.transform(createUserDTO, {
        type: 'body',
        metatype: CreateUserDTO,
      }),
    ).resolves.not.toThrow();
  });
});
