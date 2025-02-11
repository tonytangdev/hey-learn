import { Membership } from '../../../../../user/domain/entities/membership.entity';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { OrganizationMembershipRelationalEntity } from '../entities/organization-membership.relational-entity';
import { User } from '../../../../../user/domain/entities/user.entity';
import { Email } from '../../../../../user/domain/value-objects/email.value-object';
import { Organization } from '../../../../../user/domain/entities/organization.entity';
import { OrganizationType } from '../../../../../user/domain/value-objects/organization-type.value-object';
import { UserRelationalEntity } from '../entities/user.relational-entity';

export class OrganizationMembershipMapper {
  static toDomain(entity: OrganizationMembershipRelationalEntity) {
    const user = new User(
      new Email(entity.user.email),
      entity.user.id,
      entity.user.createdAt,
      entity.user.updatedAt,
      entity.user.deletedAt ?? undefined,
    );

    const organization = new Organization(
      new OrganizationType(entity.organization.type),
      undefined,
      entity.organization.id,
      entity.organization.createdAt,
      entity.organization.updatedAt,
      entity.organization.deletedAt ?? undefined,
    );

    return new Membership(
      user,
      organization,
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt ?? undefined,
    );
  }

  static toPersistence(membership: Membership) {
    const userEntity = new UserRelationalEntity();
    userEntity.email = membership.user.getEmail();
    userEntity.id = membership.user.id;
    userEntity.createdAt = membership.user.createdAt;
    userEntity.updatedAt = membership.user.updatedAt;
    userEntity.deletedAt = membership.user.deletedAt ?? null;

    const organizationEntity = new OrganizationRelationalEntity();
    organizationEntity.type = membership.organization.getOrganizationType();
    organizationEntity.id = membership.organization.id;
    organizationEntity.createdAt = membership.organization.createdAt;
    organizationEntity.updatedAt = membership.organization.updatedAt;
    organizationEntity.deletedAt = membership.organization.deletedAt ?? null;

    const entity = new OrganizationMembershipRelationalEntity();
    entity.createdAt = membership.createdAt;
    entity.updatedAt = membership.updatedAt;
    entity.deletedAt = membership.deletedAt ?? null;
    entity.id = membership.id;
    entity.user = userEntity;
    entity.organization = organizationEntity;
    return entity;
  }
}
