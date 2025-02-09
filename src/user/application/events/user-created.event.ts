export const USER_CREATED_EVENT = Symbol('USER_CREATED_EVENT');

export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly userEmail: string,
  ) {}
}

export type USER_CREATED_DOMAIN_EVENT = {
  name: typeof USER_CREATED_EVENT;
  data: UserCreatedEvent;
};
