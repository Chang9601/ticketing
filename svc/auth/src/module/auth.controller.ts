import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
// import { SignInDto } from '../dto/sign-in.dto';
import { User } from '../entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.create(createUserDto);
  }

  // @Post('sign-in')
  // @HttpCode(HttpStatus.OK)
  // signIn(@Body() signInDto: SignInDto) {}
}
