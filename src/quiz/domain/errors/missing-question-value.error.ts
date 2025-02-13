export class MissingQuestionValueError extends Error {
  constructor() {
    super('Missing question value');
    this.name = 'MissingQuestionValueError';
  }
}
