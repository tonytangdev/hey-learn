import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateQuizDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  textInput: string;
}
