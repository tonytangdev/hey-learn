import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../../../../application/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserRelationalEntity)
    private readonly userRepository: Repository<UserRelationalEntity>,
  ) {}

  async createUser(user: User): Promise<User> {
    const userEntity = UserMapper.toPersistence(user);
    const savedUser = await this.userRepository.save(userEntity);
    return UserMapper.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user ? UserMapper.toDomain(user) : null;
  }
}
