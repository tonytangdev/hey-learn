import { Repository } from 'typeorm';
import { OrganizationRepository } from '../../../../../user/application/repositories/organization.repository';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../../../../../user/domain/entities/organization.entity';
import { ORGANIZATION_TYPES } from '../../../../../user/domain/value-objects/organization-type.value-object';
import { OrganizationRelationalRepository } from './organization.relational.repository';
import { randomUUID } from 'node:crypto';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { faker } from '@faker-js/faker';
import { UserEntityBuilder } from '../../../../../user/domain/entities-builders/user.entity-builder';

describe('Organization Repository', () => {
  let organizationRepository: OrganizationRepository;
  let typeORMRepository: Repository<OrganizationRelationalEntity>;
  let entityManager: any;

  let createdBy: UserRelationalEntity;

  beforeEach(async () => {
    createdBy = new UserRelationalEntity();
    createdBy.id = randomUUID();
    createdBy.email = faker.internet.email();
    createdBy.createdAt = faker.date.past();
    createdBy.updatedAt = faker.date.past();
    createdBy.deletedAt = null;

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: OrganizationRepository,
          useClass: OrganizationRelationalRepository,
        },
        {
          provide: getRepositoryToken(OrganizationRelationalEntity),
          useValue: {
            manager: {
              save: jest.fn(() => {
                const newOrganization = new OrganizationRelationalEntity();
                newOrganization.id = randomUUID();
                newOrganization.type = ORGANIZATION_TYPES.SINGLE;
                newOrganization.createdAt = new Date();
                newOrganization.updatedAt = new Date();
                newOrganization.deletedAt = null;
                newOrganization.createdBy = createdBy;

                return newOrganization;
              }),
            },
          },
        },
      ],
    }).compile();

    organizationRepository = moduleRef.get<OrganizationRepository>(
      OrganizationRepository,
    );
    typeORMRepository = moduleRef.get<Repository<OrganizationRelationalEntity>>(
      getRepositoryToken(OrganizationRelationalEntity),
    );

    entityManager = {
      save: jest.fn(() => {
        const newOrganization = new OrganizationRelationalEntity();
        newOrganization.id = randomUUID();
        newOrganization.type = ORGANIZATION_TYPES.SINGLE;
        newOrganization.createdAt = new Date();
        newOrganization.updatedAt = new Date();
        newOrganization.deletedAt = null;
        newOrganization.createdBy = createdBy;

        return newOrganization;
      }),
    };
  });

  it('should be defined', () => {
    expect(organizationRepository).toBeDefined();
    expect(typeORMRepository).toBeDefined();
  });

  it.each([
    ORGANIZATION_TYPES.GROUP,
    ORGANIZATION_TYPES.PUBLIC,
    ORGANIZATION_TYPES.SINGLE,
  ])('should save organization', async (organizationType) => {
    const createdBy = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(organizationType, createdBy);
    await organizationRepository.create(organization);
    expect(typeORMRepository.manager.save).toHaveBeenCalledWith(
      expect.any(OrganizationRelationalEntity),
    );
  });

  it.each([
    ORGANIZATION_TYPES.GROUP,
    ORGANIZATION_TYPES.PUBLIC,
    ORGANIZATION_TYPES.SINGLE,
  ])('should save organization using context', async (organizationType) => {
    const createdBy = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(organizationType, createdBy);
    await organizationRepository.create(organization, entityManager);
    expect(entityManager.save).toHaveBeenCalledWith(
      expect.any(OrganizationRelationalEntity),
    );
  });
});
