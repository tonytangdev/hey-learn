export class OrganizationMembership {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly userId: string,
  ) {}
}
