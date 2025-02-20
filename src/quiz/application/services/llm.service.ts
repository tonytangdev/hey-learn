import { Inject, Injectable } from '@nestjs/common';
import { LLM } from '../llm/llm';

@Injectable()
export class LLMService {
  constructor(
    @Inject('LLM')
    private readonly llm: LLM,
  ) {}

  async generateQuiz(textInput: string) {
    return this.llm.generateQuiz(textInput);
  }
}
