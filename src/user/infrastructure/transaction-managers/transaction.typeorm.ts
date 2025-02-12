import { Repository } from '../../../shared/interfaces/repository';
import { Transaction } from '../../../shared/interfaces/transaction';
import { EntityManager } from 'typeorm';
import { UserRelationalRepository } from '../repositories/relational/repositories/user.relational.repository';
import { UserRelationalEntity } from '../repositories/relational/entities/user.relational-entity';
import { OrganizationRelationalRepository } from '../repositories/relational/repositories/organization.relational.repository';
import { OrganizationRelationalEntity } from '../repositories/relational/entities/organization.relational-entity';
import { OrganizationMembershipRelationalRepository } from '../repositories/relational/repositories/organization-membership.relational.repository';
import { OrganizationMembershipRelationalEntity } from '../repositories/relational/entities/organization-membership.relational-entity';

export class TransactionTypeORM implements Transaction {
  constructor(private readonly entityManager: EntityManager) {}

  getRepository<T extends Repository>(repository: T): T {
    if (repository instanceof UserRelationalRepository) {
      return new UserRelationalRepository(
        this.entityManager.getRepository(UserRelationalEntity),
      ) as unknown as T;
    } else if (repository instanceof OrganizationRelationalRepository) {
      return new OrganizationRelationalRepository(
        this.entityManager.getRepository(OrganizationRelationalEntity),
      ) as unknown as T;
    } else if (
      repository instanceof OrganizationMembershipRelationalRepository
    ) {
      return new OrganizationMembershipRelationalRepository(
        this.entityManager.getRepository(
          OrganizationMembershipRelationalEntity,
        ),
      ) as unknown as T;
    }
    throw new Error('Unknown repository type');
  }
}
