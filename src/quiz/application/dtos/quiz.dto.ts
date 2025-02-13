import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class QuizDTO {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  wrongAnswers: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
