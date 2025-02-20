import { Injectable } from '@nestjs/common';
import { LLM } from '../llm/llm';

@Injectable()
export class LLMService {
  constructor(private readonly llm: LLM) {}

  async generateQuiz(textInput: string) {
    return this.llm.generateQuiz(textInput);
  }
}
