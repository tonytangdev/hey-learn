import { randomUUID } from 'node:crypto';
import { Organization } from './organization.entity';
import { MissingOrganizationIdError } from '../errors/missing-organization-id.error';

describe('Organization', () => {
  it('should be able to create a new organization', () => {
    const id = randomUUID();
    const organization = new Organization(id);
    expect(organization).toBeInstanceOf(Organization);
    expect(organization.id).toEqual(id);
  });

  it('should throw an error if id is empty', () => {
    expect(() => new Organization('')).toThrow(
      new MissingOrganizationIdError(),
    );
  });
});
