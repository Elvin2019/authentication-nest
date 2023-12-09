import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto, LoginErrorResponseDto } from './auth.dto';
import { Public } from './auth.guard';

@ApiTags('Store Login')
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The User has been successfully logged.',
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Login Error.',
    type: LoginErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }


  async logout() {
    return  await this.authService.logout();
  }
}
