import { Test } from '@nestjs/testing';
import { LLM } from '../llm/llm';
import { LLMService } from './llm.service';
import { faker } from '@faker-js/faker';

describe('LLMService', () => {
  let service: LLMService;
  let llm: LLM;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LLMService,
        {
          provide: LLM,
          useValue: {
            generateQuiz: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LLMService>(LLMService);
    llm = module.get<LLM>(LLM);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call generateQuiz method of LLM', async () => {
    const generateQuizSpy = jest.spyOn(llm, 'generateQuiz');
    const text = faker.lorem.paragraph();
    await service.generateQuiz(text);
    expect(generateQuizSpy).toHaveBeenCalledWith(text);
  });
});
