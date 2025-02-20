import { Injectable, Logger } from '@nestjs/common';
import { LLM } from '../../application/llm/llm';
import { CreateQuizDTO } from '../../application/dtos/create-quiz.dto';

@Injectable()
export class LocalLLM implements LLM {
  private readonly logger = new Logger(LocalLLM.name);

  async generateQuiz(
    textInput: string,
  ): Promise<Pick<CreateQuizDTO, 'question' | 'answer' | 'wrongAnswers'>[]> {
    try {
      const request = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1-distill-qwen-32b',
          // model: 'meta-llama-3.1-8b-instruct',
          messages: [
            {
              role: 'system',
              content: `
              I will give you some text and you will extract 10 questions out of it and you will generate 4 answers for each questions : the right answer and 3 wrong answers.
            `,
            },
            { role: 'user', content: textInput },
          ],
          temperature: 0.7,
          max_tokens: -1,
          stream: false,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'quiz_response',
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    question: { type: 'string' },
                    answer: { type: 'string' },
                    wrongAnswers: {
                      type: 'array',
                      items: { type: 'string' },
                      minItems: 3,
                      maxItems: 3,
                    },
                  },
                  minItems: 10,
                  required: ['question', 'answer', 'wrongAnswers'],
                  additionalProperties: false,
                },
              },
              strict: true,
            },
          },
        }),
      });

      const response = (await request.json()) as {
        choices: {
          message: {
            content: string;
          };
        }[];
      };

      return JSON.parse(response.choices[0].message.content) as Pick<
        CreateQuizDTO,
        'question' | 'answer' | 'wrongAnswers'
      >[];
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}
