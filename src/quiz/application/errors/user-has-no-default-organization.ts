export class UserHasNoDefaultOrganization extends Error {
  constructor(userId: string) {
    super(
      `User ${userId} has no default organization. Please set a default organization.`,
    );
  }
}
