import { MissingOrganizationIdError } from '../errors/missing-organization-id.error';

export class Organization {
  constructor(public readonly id: string) {
    if (!id) {
      throw new MissingOrganizationIdError();
    }
  }
}
