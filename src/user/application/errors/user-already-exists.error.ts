export class UserAlreadyExists extends Error {
  constructor(email: string) {
    super();
    this.name = UserAlreadyExists.name;
    this.message = `User with email ${email} already exists`;
  }
}
