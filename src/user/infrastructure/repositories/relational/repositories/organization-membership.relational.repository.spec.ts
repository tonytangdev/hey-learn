import { OrganizationMembershipRepository } from '../../../../../user/application/repositories/organization-membership.repository';
import { OrganizationMembershipRelationalEntity } from '../entities/organization-membership.relational-entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Membership } from '../../../../../user/domain/entities/membership.entity';
import { faker } from '@faker-js/faker';
import { Organization } from '../../../../../user/domain/entities/organization.entity';
import { ORGANIZATION_TYPES } from '../../../../../user/domain/value-objects/organization-type.value-object';
import { OrganizationMembershipRelationalRepository } from './organization-membership.relational.repository';
import { randomUUID } from 'node:crypto';
import { UserRelationalEntity } from '../entities/user.relational-entity';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { UserEntityBuilder } from '../../../../../user/domain/entities-builders/user.entity-builder';

describe('OrganizationMembershipRelationalRepository', () => {
  let organizationMembershipRelationRepository: OrganizationMembershipRepository;
  let typeORMRepository: Repository<OrganizationMembershipRelationalEntity>;

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
            findOne: jest.fn(),
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
      ],
    }).compile();

    organizationMembershipRelationRepository =
      moduleRef.get<OrganizationMembershipRepository>(
        OrganizationMembershipRepository,
      );
    typeORMRepository = moduleRef.get<
      Repository<OrganizationMembershipRelationalEntity>
    >(getRepositoryToken(OrganizationMembershipRelationalEntity));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(organizationMembershipRelationRepository).toBeDefined();
  });

  it('should save organization membership', async () => {
    const user = new UserEntityBuilder()
      .withEmail(faker.internet.email())
      .build();
    const organization = new Organization(ORGANIZATION_TYPES.SINGLE);
    const membership = new Membership(user, organization);

    await organizationMembershipRelationRepository.create(membership);
    expect(typeORMRepository.save).toHaveBeenCalledWith(
      expect.any(OrganizationMembershipRelationalEntity),
    );
  });

  it('should find organization membership by id', async () => {
    const membership = new Membership(
      new UserEntityBuilder().withEmail(faker.internet.email()).build(),
      new Organization(ORGANIZATION_TYPES.SINGLE),
    );

    const organizationMembershipEntity =
      new OrganizationMembershipRelationalEntity();
    organizationMembershipEntity.id = randomUUID();
    organizationMembershipEntity.user = new UserRelationalEntity();
    organizationMembershipEntity.user.id = membership.user.id;
    organizationMembershipEntity.user.email = membership.user.getEmail();
    organizationMembershipEntity.organization =
      new OrganizationRelationalEntity();
    organizationMembershipEntity.organization.id = membership.organization.id;
    organizationMembershipEntity.organization.type =
      membership.organization.getOrganizationType();

    const spy = jest
      .spyOn(typeORMRepository, 'findOne')
      .mockResolvedValue(organizationMembershipEntity);

    const res =
      await organizationMembershipRelationRepository.findByOrganizationIdAndUserId(
        membership.organization.id,
        membership.user.id,
      );

    expect(spy).toHaveBeenCalledWith({
      where: {
        organization: { id: membership.organization.id },
        user: { id: membership.user.id },
      },
    });

    expect(res).toEqual(expect.any(Membership));
  });

  it('should return null if organization membership not found', async () => {
    const spy = jest
      .spyOn(typeORMRepository, 'findOne')
      .mockResolvedValue(null);
    const userId = randomUUID();
    const organizationId = randomUUID();

    const res =
      await organizationMembershipRelationRepository.findByOrganizationIdAndUserId(
        organizationId,
        userId,
      );

    expect(res).toBeNull();
    expect(spy).toHaveBeenCalledWith({
      where: {
        organization: { id: organizationId },
        user: { id: userId },
      },
    });
  });
});
