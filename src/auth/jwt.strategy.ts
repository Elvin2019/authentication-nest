import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('AUTH_SECRET_KEY'),
    });
  }

  async validate(payload: { sub: string; login: string }): Promise<{ id: string; login: string; }> {
    return {
      id: payload.sub,
      login: payload.login,
    };
  }
}
