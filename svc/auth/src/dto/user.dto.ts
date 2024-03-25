import { IsString } from 'class-validator';

import { BaseDto } from './base.dto';
import { EmailValidator } from '../decorator/dto.decorator';

export class UserDto extends BaseDto {
  @EmailValidator()
  public email: string;

  @IsString()
  public password: string;

  constructor(email?: string, password?: string) {
    super();

    this.email = email || '';
    this.password = password || '';
  }
}
