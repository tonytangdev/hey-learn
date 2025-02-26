import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateQuizDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsNotEmpty()
  textInput: string;
}
