import { IsNotEmpty, IsString } from 'class-validator';
import { Answer } from '../../domain/entities/answer.entity';
import { User } from '../../../user/domain/entities/user.entity';

export class AnswerQuizDTO {
  @IsString()
  @IsNotEmpty()
  userId: User['id'];

  @IsString()
  @IsNotEmpty()
  answerId: Answer['id'];
}
