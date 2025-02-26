import { Injectable } from '@nestjs/common';
import { CreateQuizDTO } from '../../../quiz/application/dtos/create-quiz.dto';
import { LLM } from '../../../quiz/application/llm/llm';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const QuestionsSchema = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
    wrongAnswers: z.array(z.string()),
  }),
);

const OpenAIResponseSchema = z.object({
  questions: QuestionsSchema,
});

@Injectable()
export class OpenAiLLM implements LLM {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI();
  }

  async generateQuiz(
    textInput: string,
  ): Promise<Pick<CreateQuizDTO, 'question' | 'answer' | 'wrongAnswers'>[]> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `I will give you some text and you will extract 10 questions out of it and you will generate 4 answers for each questions : the right answer and 3 wrong answers.`,
        },
        { role: 'user', content: textInput },
      ],
      response_format: zodResponseFormat(OpenAIResponseSchema, 'questions'),
    });

    const response = OpenAIResponseSchema.parse(
      JSON.parse(completion.choices[0].message.content ?? ''),
    );

    return response.questions;
  }
}
