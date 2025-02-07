export const USER_CREATED_EVENT = Symbol('USER_CREATED_EVENT');

export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly userEmail: string,
  ) {}
}
