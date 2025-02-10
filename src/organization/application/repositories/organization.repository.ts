import { Organization } from '../../../organization/domain/entities/organization.entity';

export abstract class OrganizationRepository {
  abstract create(
    organization: Organization,
    context?: any,
  ): Promise<Organization>;
}
