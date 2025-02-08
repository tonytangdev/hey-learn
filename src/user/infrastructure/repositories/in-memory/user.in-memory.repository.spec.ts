import { User } from '../../../domain/entities/user.entity';
import { UserInMemoryRepository } from './user.in-memory.repository';
import { Email } from '../../../domain/value-objects/email.value-object';
import { faker } from '@faker-js/faker';

describe('UserInMemoryRepository', () => {
  let userRepository: UserInMemoryRepository;
  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
  });
  it('should add a user', async () => {
    const email = new Email(faker.internet.email());
    const user = new User(email);
    await userRepository.createUser(user);
    const userFound = await userRepository.findByEmail(email.value);
    expect(userFound).toEqual(user);
  });
  it('should not find a user', async () => {
    const email = new Email(faker.internet.email());
    const userFound = await userRepository.findByEmail(email.value);
    expect(userFound).toBeNull();
  });
});
