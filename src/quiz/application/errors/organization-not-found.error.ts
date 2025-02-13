import { Organization } from '../../domain/entities/organization.entity';

export class OrganizationNotFoundError extends Error {
  constructor(organizationId: Organization['id']) {
    super(`Organization with id ${organizationId} not found`);
    this.name = 'OrganizationNotFoundError';
  }
}
