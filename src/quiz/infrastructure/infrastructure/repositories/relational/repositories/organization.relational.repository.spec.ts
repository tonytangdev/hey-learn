import { Repository } from 'typeorm';
import { OrganizationRelationalRepository } from './organization.relational.repository';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../../../../../domain/entities/organization.entity';
import { randomUUID } from 'node:crypto';

describe('Organization Relational Repository', () => {
  let organizationRelationalRepository: OrganizationRelationalRepository;
  let mockRepository: Repository<OrganizationRelationalEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrganizationRelationalRepository,
        {
          provide: getRepositoryToken(OrganizationRelationalEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    organizationRelationalRepository =
      moduleRef.get<OrganizationRelationalRepository>(
        OrganizationRelationalRepository,
      );
    mockRepository = moduleRef.get<Repository<OrganizationRelationalEntity>>(
      getRepositoryToken(OrganizationRelationalEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(organizationRelationalRepository).toBeDefined();
  });

  it('should return an organization by id', async () => {
    const organization = new Organization(randomUUID());
    const mockOrganization = new OrganizationRelationalEntity();
    mockOrganization.id = organization.id;

    jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(mockOrganization);

    const result = await organizationRelationalRepository.findById(
      organization.id,
    );

    expect(result).toEqual(mockOrganization);
  });

  it('should return null if organization is not found', async () => {
    const organizationId = randomUUID();
    jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(null);

    const result =
      await organizationRelationalRepository.findById(organizationId);

    expect(result).toBeNull();
  });
});
