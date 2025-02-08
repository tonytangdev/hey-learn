import {
  ORGANIZATION_TYPES,
  OrganizationType,
} from './organization-type.value-object';

describe('OrganizationTypeValueObject', () => {
  const organizationTypes = Object.keys(
    ORGANIZATION_TYPES,
  ) as ORGANIZATION_TYPES[];

  it.each(organizationTypes)(
    'should instantiate an organization with type %p',
    (type) => {
      const organization = new OrganizationType(type);
      expect(organization).toBeInstanceOf(OrganizationType);
    },
  );
});
