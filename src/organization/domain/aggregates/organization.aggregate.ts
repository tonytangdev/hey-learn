import { Organization } from '../entities/organization.entity';
import { Membership } from '../entities/membership.entity';
import { User } from '../../../user/domain/entities/user.entity';

export class OrganizationAggregate {
  constructor(
    public readonly organization: Organization,
    public readonly members: Membership[],
  ) {}

  public addMember(user: User): void {
    const member = new Membership(user, this.organization);

    this.members.push(member);
  }
}
