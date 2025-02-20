import { Test } from '@nestjs/testing';
import { UserRelationalRepository } from './user.relational.repository';
import { UserRepository } from '../../../../application/repositories/user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { User } from '../../../../../user/domain/entities/user.entity';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { UserEntityBuilder } from '../../../../../user/domain/entities-builders/user.entity-builder';

describe('UserRelationalRepository', () => {
  let userRelationalRepository: UserRelationalRepository;
  let typeORMRepository: Repository<UserRelationalEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRelationalRepository,
        },
        {
          provide: getRepositoryToken(UserRelationalEntity),
          useValue: {
            findOneBy: jest.fn(() => {
              const newUser = new UserRelationalEntity();
              newUser.id = randomUUID();
              newUser.email = faker.internet.email();
              newUser.createdAt = new Date();
              newUser.updatedAt = new Date();
              newUser.deletedAt = null;
              return newUser;
            }),
            save: jest.fn(() => {
              const newUser = new UserRelationalEntity();
              newUser.id = randomUUID();
              newUser.email = faker.internet.email();
              newUser.createdAt = new Date();
              newUser.updatedAt = new Date();
              newUser.deletedAt = null;
              return newUser;
            }),
          },
        },
      ],
    }).compile();

    userRelationalRepository =
      moduleRef.get<UserRelationalRepository>(UserRepository);

    typeORMRepository = moduleRef.get<Repository<UserRelationalEntity>>(
      getRepositoryToken(UserRelationalEntity),
    );
  });

  it('should be defined', () => {
    expect(userRelationalRepository).toBeDefined();
  });

  it('should create a user with repository', async () => {
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const newUser = await userRelationalRepository.createUser(user);
    expect(typeORMRepository.save).toHaveBeenCalledWith(
      expect.any(UserRelationalEntity),
    );
    expect(newUser).toBeInstanceOf(User);
  });

  it('should find a user by email', async () => {
    const email = faker.internet.email();
    const foundUser = await userRelationalRepository.findByEmail(email);
    expect(foundUser).toBeInstanceOf(User);
    if (!foundUser) {
      fail('User not found');
    }
    expect(foundUser.getEmail()).toBeTruthy();
    expect(typeORMRepository.findOneBy).toHaveBeenCalledWith({
      email: expect.any(String) as unknown as string,
    });
  });

  it('should return null if user not found', async () => {
    const email = faker.internet.email();
    (typeORMRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    const foundUser = await userRelationalRepository.findByEmail(email);
    expect(foundUser).toBeNull();
    expect(typeORMRepository.findOneBy).toHaveBeenCalledWith({
      email: expect.any(String) as unknown as string,
    });
  });
});
