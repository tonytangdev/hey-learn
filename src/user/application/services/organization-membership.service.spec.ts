import { OrganizationMembershipService } from './organization-membership.service';
import { Test } from '@nestjs/testing';
import { OrganizationMembershipRepository } from '../repositories/organization-membership.repository';
import { Membership } from '../../../user/domain/entities/membership.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { Organization } from '../../../user/domain/entities/organization.entity';

describe('Organization Membership service', () => {
  let organizationService: OrganizationMembershipService;
  let organizationMembershipRepository: OrganizationMembershipRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrganizationMembershipService,
        {
          provide: OrganizationMembershipRepository,
          useValue: {
            findByOrganizationIdAndUserId: jest.fn(),
          },
        },
      ],
    }).compile();
    organizationService = moduleRef.get<OrganizationMembershipService>(
      OrganizationMembershipService,
    );
    organizationMembershipRepository =
      moduleRef.get<OrganizationMembershipRepository>(
        OrganizationMembershipRepository,
      );
  });

  it('should be defined', () => {
    expect(organizationService).toBeDefined();
  });

  it('should find membership by organization id and user id', async () => {
    const organizationId = 'organizationId';
    const userId = 'userId';
    const membership = new Membership(
      {} as unknown as User,
      {} as unknown as Organization,
    );

    jest
      .spyOn(organizationMembershipRepository, 'findByOrganizationIdAndUserId')
      .mockResolvedValue(membership);

    const result = await organizationService.findByOrganizationIdAndUserId(
      organizationId,
      userId,
    );
    expect(result).toBe(membership);
  });

  it('should return null if membership not found', async () => {
    const organizationId = 'organizationId';
    const userId = 'userId';

    jest
      .spyOn(organizationMembershipRepository, 'findByOrganizationIdAndUserId')
      .mockResolvedValue(null);

    const result = await organizationService.findByOrganizationIdAndUserId(
      organizationId,
      userId,
    );
    expect(result).toBeNull();
  });
});
