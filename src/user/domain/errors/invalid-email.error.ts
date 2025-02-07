export class InvalidEmailError extends Error {
  constructor() {
    super('InvalidEmailError');
    this.name = 'InvalidEmailError';
  }
}
