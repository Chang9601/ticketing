import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiResponse } from '../api/api-response';
import { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mapper/user-mapper';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { Request, Response } from 'express';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  public async signUp(@Body() userDto: UserDto): Promise<ApiResponse<UserDto>> {
    return this.authService.create(UserMapper.toEntity(userDto));
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  signIn(@Req() request: Request, @Res() response: Response) {
    const { user } = request;
  }
}
