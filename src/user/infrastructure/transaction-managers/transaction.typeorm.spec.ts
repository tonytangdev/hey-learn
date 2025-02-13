import { EntityManager } from 'typeorm';
import { UserRelationalRepository } from '../repositories/relational/repositories/user.relational.repository';
import { UserRelationalEntity } from '../repositories/relational/entities/user.relational-entity';
import { OrganizationRelationalRepository } from '../repositories/relational/repositories/organization.relational.repository';
import { OrganizationRelationalEntity } from '../repositories/relational/entities/organization.relational-entity';
import { OrganizationMembershipRelationalRepository } from '../repositories/relational/repositories/organization-membership.relational.repository';
import { OrganizationMembershipRelationalEntity } from '../repositories/relational/entities/organization-membership.relational-entity';
import { TransactionTypeORM } from './transaction.typeorm';

describe('TransactionTypeORM', () => {
  let mockEntityManager: jest.Mocked<EntityManager>;

  beforeEach(() => {
    mockEntityManager = {
      getRepository: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;
  });

  describe('getRepository', () => {
    it('should return UserRelationalRepository with correct entity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mockUserRepo = {} as any;
      mockEntityManager.getRepository.mockImplementation((entity) => {
        if (entity === UserRelationalEntity) return mockUserRepo;
        return null as any;
      });

      const transaction = new TransactionTypeORM(mockEntityManager);
      const dummyUserRepo = new UserRelationalRepository(mockUserRepo);

      const result = transaction.getRepository(dummyUserRepo);

      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(
        UserRelationalEntity,
      );
      expect(result).toBeInstanceOf(UserRelationalRepository);
    });

    it('should return OrganizationRelationalRepository with correct entity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mockOrgRepo = {} as any;
      mockEntityManager.getRepository.mockImplementation((entity) => {
        if (entity === OrganizationRelationalEntity) return mockOrgRepo;
        return null as any;
      });

      const transaction = new TransactionTypeORM(mockEntityManager);
      const dummyOrgRepo = new OrganizationRelationalRepository(mockOrgRepo);

      const result = transaction.getRepository(dummyOrgRepo);

      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(
        OrganizationRelationalEntity,
      );
      expect(result).toBeInstanceOf(OrganizationRelationalRepository);
    });

    it('should return OrganizationMembershipRelationalRepository with correct entity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mockMembershipRepo = {} as any;
      mockEntityManager.getRepository.mockImplementation((entity) => {
        if (entity === OrganizationMembershipRelationalEntity)
          return mockMembershipRepo;
        return null as any;
      });

      const transaction = new TransactionTypeORM(mockEntityManager);
      const dummyMembershipRepo =
        new OrganizationMembershipRelationalRepository(mockMembershipRepo);

      const result = transaction.getRepository(dummyMembershipRepo);

      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(
        OrganizationMembershipRelationalEntity,
      );
      expect(result).toBeInstanceOf(OrganizationMembershipRelationalRepository);
    });

    it('should throw an error for unknown repository type', () => {
      class UnknownRepository {}
      const unknownRepo = new UnknownRepository();

      const transaction = new TransactionTypeORM(mockEntityManager);

      expect(() => transaction.getRepository(unknownRepo as any)).toThrow(
        'Unknown repository type',
      );
    });
  });
});
