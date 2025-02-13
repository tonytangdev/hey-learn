export class MissingOrganizationIdError extends Error {
  constructor() {
    super('Missing organization id');
    this.name = 'MissingOrganizationIdError';
  }
}
