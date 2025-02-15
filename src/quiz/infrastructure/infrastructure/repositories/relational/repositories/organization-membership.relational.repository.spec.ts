import { Repository } from 'typeorm';
import { OrganizationMembershipRelationalRepository } from './organization-membership.relational.repository';
import { OrganizationMembershipRelationalEntity } from '../entities/organization-membership.relational-entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';

describe('Organization Membership Relational Repository', () => {
  let organizationMembershipRelationalRepository: OrganizationMembershipRelationalRepository;
  let mockRepository: Repository<OrganizationMembershipRelationalEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrganizationMembershipRelationalRepository,
        {
          provide: getRepositoryToken(OrganizationMembershipRelationalEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    organizationMembershipRelationalRepository =
      moduleRef.get<OrganizationMembershipRelationalRepository>(
        OrganizationMembershipRelationalRepository,
      );
    mockRepository = moduleRef.get<
      Repository<OrganizationMembershipRelationalEntity>
    >(getRepositoryToken(OrganizationMembershipRelationalEntity));
  });

  it('should be defined', () => {
    expect(organizationMembershipRelationalRepository).toBeDefined();
  });

  it('return a membership', async () => {
    const userId = randomUUID();
    const organizationId = randomUUID();

    const mockMembership = new OrganizationMembershipRelationalEntity();
    mockMembership.userId = userId;
    mockMembership.organizationId = organizationId;
    jest.spyOn(mockRepository, 'findOne').mockResolvedValue(mockMembership);

    const membership =
      await organizationMembershipRelationalRepository.findByOrganizationIdAndUserId(
        organizationId,
        userId,
      );

    if (!membership) {
      fail('Membership not found');
    }

    expect(membership).toBeDefined();
    expect(membership.userId).toBe(userId);
    expect(membership.organizationId).toBe(organizationId);
  });

  it('should return null if membership does not exist', async () => {
    const userId = randomUUID();
    const organizationId = randomUUID();
    jest.spyOn(mockRepository, 'findOne').mockResolvedValue(null);

    const membership =
      await organizationMembershipRelationalRepository.findByOrganizationIdAndUserId(
        organizationId,
        userId,
      );

    expect(membership).toBeNull();
  });
});
