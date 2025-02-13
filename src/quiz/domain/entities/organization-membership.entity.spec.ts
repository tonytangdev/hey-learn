import { randomUUID } from 'node:crypto';
import { OrganizationMembership } from './organization-membership.entity';

describe('OrganizationMembership', () => {
  it('should create a new organization membership', () => {
    const id = randomUUID();
    const organizationId = randomUUID();
    const userId = randomUUID();

    const organizationMembership = new OrganizationMembership(
      id,
      organizationId,
      userId,
    );

    expect(organizationMembership).toBeInstanceOf(OrganizationMembership);
    expect(organizationMembership.id).toBe(id);
    expect(organizationMembership.organizationId).toBe(organizationId);
    expect(organizationMembership.userId).toBe(userId);
  });
});
