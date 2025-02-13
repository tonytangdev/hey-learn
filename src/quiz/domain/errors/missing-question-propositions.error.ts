export class MissingQuestionPropositionsError extends Error {
  constructor() {
    super('Missing question propositions');
    this.name = 'MissingQuestionPropositionsError';
  }
}
