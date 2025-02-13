export class MissingAnswerError extends Error {
  constructor() {
    super('Missing answer');
    this.name = 'MissingAnswerError';
  }
}
