import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { TokenPayload, UserPayload } from '../type/auth-type';
import { AuthService } from '../module/auth.service';
import { ServerEnv } from '../config/env/server-env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authSerivce: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.AccessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: ServerEnv.ACCESS_TOKEN_SECRET,
    });
  }

  public async validate(token: TokenPayload): Promise<UserPayload> {
    const { id } = token;

    const userPayload = await this.authSerivce.findOne(id);

    return userPayload;
  }
}
