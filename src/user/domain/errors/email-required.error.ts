export class EmailRequiredError extends Error {
  constructor() {
    super('Email is required');
    this.name = 'EmailRequiredError';
  }
}
