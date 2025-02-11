import { OrganizationType } from '../../../../../user/domain/value-objects/organization-type.value-object';
import { OrganizationRelationalEntity } from '../entities/organization.relational-entity';
import { User } from '../../../../../user/domain/entities/user.entity';
import { Email } from '../../../../../user/domain/value-objects/email.value-object';
import { Organization } from '../../../../../user/domain/entities/organization.entity';
import { UserRelationalEntity } from '../entities/user.relational-entity';

export class OrganizationMapper {
  static toDomain(organizationRelationalEntity: OrganizationRelationalEntity) {
    const organizationType = new OrganizationType(
      organizationRelationalEntity.type,
    );
    let createdBy: User | undefined;
    if (organizationRelationalEntity.createdBy) {
      createdBy = new User(
        new Email(organizationRelationalEntity.createdBy.email),
        organizationRelationalEntity.createdBy.id,
        organizationRelationalEntity.createdBy.createdAt,
        organizationRelationalEntity.createdBy.updatedAt,
        organizationRelationalEntity.createdBy.deletedAt ?? undefined,
      );
    }

    return new Organization(
      organizationType,
      createdBy,
      organizationRelationalEntity.id,
      organizationRelationalEntity.createdAt,
      organizationRelationalEntity.updatedAt,
      organizationRelationalEntity.deletedAt ?? undefined,
    );
  }

  static toRelational(organization: Organization) {
    const organizationEntity = new OrganizationRelationalEntity();
    organizationEntity.id = organization.id;
    organizationEntity.type = organization.getOrganizationType();
    organizationEntity.createdAt = organization.createdAt;
    organizationEntity.updatedAt = organization.updatedAt;
    organizationEntity.deletedAt = organization.deletedAt ?? null;
    if (organization.getCreatedBy()) {
      const userEntity = new UserRelationalEntity();
      userEntity.id = organization.getCreatedBy()!.id;
      userEntity.email = organization.getCreatedBy()!.getEmail();
      userEntity.createdAt = organization.getCreatedBy()!.createdAt;
      userEntity.updatedAt = organization.getCreatedBy()!.updatedAt;
      userEntity.deletedAt = organization.getCreatedBy()!.deletedAt ?? null;
      organizationEntity.createdBy = userEntity;
    }

    return organizationEntity;
  }
}
