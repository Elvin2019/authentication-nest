import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface UserPayload {
  login: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  public async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('Incorrect Login', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException('Incorrect Login', HttpStatus.UNAUTHORIZED);
    }

    const payload: UserPayload = { login: user.email, sub: user.id };
    delete user.password;

    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('AUTH_SECRET_KEY'),
      expiresIn: this.config.get<string>('AUTH_EXPIRE_TIME'),
    });

    return {
      response: {
        token,
      },
      statusCode: HttpStatus.OK,
    };
  }
  public async logout(token: string) {
    await this.cacheManager.set(token, true, 60 * 60 * 1000);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
