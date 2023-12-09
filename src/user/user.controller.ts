import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.guard';
import { User } from './user.schema';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user.dto';

@ApiTags('User')
@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Post()
  async create(@Body() user: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.create(user);
  }
}
