import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { ApiResponse } from '../api/api-response';
import { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mapper/user-mapper';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { RequestWithUser, UserPayload } from '../type/auth-type';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Code } from '../code/code';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  public async signUp(@Body() userDto: UserDto): Promise<ApiResponse<UserDto>> {
    return this.authService.create(UserMapper.toEntity(userDto));
  }

  // 경로에서 passport-local 전략이 호출되는 방법을 다음과 같다.
  // @nestjs/passport 모듈의 내장 가드(AuthGuard)를 사용해 Passport 전략을 호출하고 단계들(자격 증명 검색, 검증 콜백 함수 실행, user 속성 생성 등)을 시작한다.
  // Passport 로컬 전략은 local이라는 기본 이름을 가지며 @UseGuards() 데코레이터에서 이를 참조하여 passport-local 패키지에서 제공하는 코드와 연관시킨다.
  // 사용자가 자격 증명이 유효할 경우에만 경로 핸들러가 호출된다.
  // Request 매개변수에 user 속성이 포함된다(passport-local 인증 흐름 중 Passport에 의해 채워진다).
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  public async signIn(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<void> {
    const { user } = request;
    const cookie = await this.authService.signIn(user);

    // TODO: ApiReponse
    response.setHeader('Set-Cookie', cookie).send(user);
  }

  @Get('/info')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public getInfo(@Req() request: RequestWithUser): ApiResponse<UserPayload> {
    const { user } = request;

    return ApiResponse.handleSuccess(Code.OK.code, Code.OK.message, user);
  }
}
