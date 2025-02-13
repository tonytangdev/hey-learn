import { Organization } from '../../domain/entities/organization.entity';

export abstract class OrganizationRepository {
  abstract findById(id: Organization['id']): Promise<Organization | null>;
}
