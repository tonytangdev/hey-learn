import { Organization } from '../entities/organization.entity';
import { Membership } from '../entities/membership.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { OrganizationType } from '../value-objects/organization-type.value-object';

export class OrganizationAggregate {
  constructor(
    public readonly organization: Organization,
    public readonly members: Membership[],
  ) {}

  static createOrganization(
    organizationType: OrganizationType,
    user: User,
  ): OrganizationAggregate {
    const organization = new Organization(
      organizationType,
      undefined,
      undefined,
      undefined,
      user,
    );
    const members = [];
    return new OrganizationAggregate(organization, members);
  }

  public addMember(user: User): void {
    const member = new Membership(user, this.organization);

    this.members.push(member);
  }
}
