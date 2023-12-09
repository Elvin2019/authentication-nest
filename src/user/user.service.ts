import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './user.dto';
@Injectable()
export class UserService {
  @Inject(ConfigService) private readonly config: ConfigService;
  @Inject(JwtService) private jwtService: JwtService;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(user: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if(existingUser) {
        throw new BadRequestException('User already exists')
    }
    
    const newUser = new this.userModel({
      ...user,
      password: user.password
        ? await this.hashPassword(user.password)
        : undefined,
    });

    newUser.save()
    return newUser;
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
