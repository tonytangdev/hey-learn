export enum ORGANIZATION_TYPES {
  PUBLIC = 'PUBLIC',
  SINGLE = 'SINGLE',
  GROUP = 'GROUP',
}

export class OrganizationType {
  constructor(public readonly value: ORGANIZATION_TYPES) {}
}
