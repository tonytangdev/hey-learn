import { faker } from '@faker-js/faker';
import { CreateUserDTO } from './create-user.dto';
import { ValidationPipe } from '@nestjs/common';

describe('CreateUserDto', () => {
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

  it('should not throw an error if email is valid', async () => {
    const createUserDTO = new CreateUserDTO();
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
