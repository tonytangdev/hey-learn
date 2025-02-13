export class UserNotMemberOfOrganizationError extends Error {
  constructor() {
    super();
    this.name = 'UserNotMemberOfOrganizationError';
  }
}
