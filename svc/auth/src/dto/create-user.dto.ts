import { IsString } from 'class-validator';

import { EmailValidator } from 'src/decorator/dto.decorator';

export class CreateUserDto {
  @EmailValidator()
  email: string;

  @IsString()
  password: string;
}
