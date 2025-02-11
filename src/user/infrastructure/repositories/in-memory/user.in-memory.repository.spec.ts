import { UserInMemoryRepository } from './user.in-memory.repository';
import { faker } from '@faker-js/faker';
import { UserEntityBuilder } from '../../../../user/domain/entities-builders/user.entity-builder';

describe('UserInMemoryRepository', () => {
  let userRepository: UserInMemoryRepository;
  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
  });
  it('should add a user', async () => {
    const email = faker.internet.email();
    const user = new UserEntityBuilder().withEmail(email).build();
    await userRepository.createUser(user);
    const userFound = await userRepository.findByEmail(email);
    expect(userFound).toEqual(user);
  });
  it('should not find a user', async () => {
    const userFound = await userRepository.findByEmail(faker.internet.email());
    expect(userFound).toBeNull();
  });
});
