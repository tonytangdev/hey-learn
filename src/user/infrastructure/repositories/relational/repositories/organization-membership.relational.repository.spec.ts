import { OrganizationMembershipRepository } from '../../../../../user/application/repositories/organization-membership.repository';
import { OrganizationMembershipRelationalEntity } from '../entities/organization-membership.relational-entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Membership } from '../../../../../user/domain/entities/membership.entity';
import { User } from '../../../../../user/domain/entities/user.entity';
import { Email } from '../../../../../user/domain/value-objects/email.value-object';
import { faker } from '@faker-js/faker';
import { Organization } from '../../../../../user/domain/entities/organization.entity';
import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from '../../../../../user/domain/value-objects/organization-type.value-object';
import { OrganizationMembershipRelationalRepository } from './organization-membership.relational.repository';
import { randomUUID } from 'node:crypto';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { UserEntityBuilder } from '../../../../../user/domain/entities-builders/user.entity-builder';

describe('OrganizationMembershipRelationalRepository', () => {
  let organizationMembershipRelationRepository: OrganizationMembershipRepository;
  let typeORMRepository: Repository<OrganizationMembershipRelationalEntity>;
  let entityManager: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: OrganizationMembershipRepository,
          useClass: OrganizationMembershipRelationalRepository,
        },
        {
          provide: getRepositoryToken(OrganizationMembershipRelationalEntity),
          useValue: {
            manager: {
              save: jest.fn(() => {
                const entity = new OrganizationMembershipRelationalEntity();
                entity.id = randomUUID();
                entity.createdAt = new Date();
                entity.updatedAt = new Date();
                entity.deletedAt = null;

                const userEntity = new UserRelationalEntity();
                userEntity.id = randomUUID();
                userEntity.email = faker.internet.email();
                userEntity.createdAt = new Date();
                userEntity.updatedAt = new Date();
                userEntity.deletedAt = null;
                entity.user = userEntity;

                const organizationEntity = new OrganizationRelationalEntity();
                organizationEntity.id = randomUUID();
                organizationEntity.type = ORGANIZATION_TYPES.SINGLE;
                organizationEntity.createdAt = new Date();
                organizationEntity.updatedAt = new Date();
                organizationEntity.deletedAt = null;

                const createdByEntity = new UserRelationalEntity();
                createdByEntity.id = randomUUID();
                createdByEntity.email = faker.internet.email();
                createdByEntity.createdAt = new Date();
                createdByEntity.updatedAt = new Date();
                createdByEntity.deletedAt = null;
                organizationEntity.createdBy = createdByEntity;
                entity.organization = organizationEntity;

                return entity;
              }),
            },
          },
        },
      ],
    }).compile();

    organizationMembershipRelationRepository =
      moduleRef.get<OrganizationMembershipRepository>(
        OrganizationMembershipRepository,
      );
    typeORMRepository = moduleRef.get<
      Repository<OrganizationMembershipRelationalEntity>
    >(getRepositoryToken(OrganizationMembershipRelationalEntity));

    entityManager = {
      save: jest.fn(() => {
        const entity = new OrganizationMembershipRelationalEntity();
        entity.id = randomUUID();
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.deletedAt = null;

        const userEntity = new UserRelationalEntity();
        userEntity.id = randomUUID();
        userEntity.email = faker.internet.email();
        userEntity.createdAt = new Date();
        userEntity.updatedAt = new Date();
        userEntity.deletedAt = null;
        entity.user = userEntity;

        const organizationEntity = new OrganizationRelationalEntity();
        organizationEntity.id = randomUUID();
        organizationEntity.type = ORGANIZATION_TYPES.SINGLE;
        organizationEntity.createdAt = new Date();
        organizationEntity.updatedAt = new Date();
        organizationEntity.deletedAt = null;

        const createdByEntity = new UserRelationalEntity();
        createdByEntity.id = randomUUID();
        createdByEntity.email = faker.internet.email();
        createdByEntity.createdAt = new Date();
        createdByEntity.updatedAt = new Date();
        createdByEntity.deletedAt = null;
        organizationEntity.createdBy = createdByEntity;
        entity.organization = organizationEntity;

        return entity;
      }),
    };
  });

  it('should be defined', () => {
    expect(organizationMembershipRelationRepository).toBeDefined();
  });

  it('should save organization membership', async () => {
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(
      new OrganizationType(ORGANIZATION_TYPES.SINGLE),
    );
    const membership = new Membership(user, organization);

    await organizationMembershipRelationRepository.create(membership);
    expect(typeORMRepository.manager.save).toHaveBeenCalledWith(
      expect.any(OrganizationMembershipRelationalEntity),
    );
  });

  it('should save organization membership with entity manager', async () => {
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(
      new OrganizationType(ORGANIZATION_TYPES.SINGLE),
    );
    const membership = new Membership(user, organization);

    await organizationMembershipRelationRepository.create(
      membership,
      entityManager,
    );
    expect(entityManager.save).toHaveBeenCalledWith(
      expect.any(OrganizationMembershipRelationalEntity),
    );
  });
});
