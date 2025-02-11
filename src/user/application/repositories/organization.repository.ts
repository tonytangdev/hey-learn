import { Organization } from '../../domain/entities/organization.entity';

export abstract class OrganizationRepository {
  abstract create(
    organization: Organization,
    context?: any,
  ): Promise<Organization>;
}
