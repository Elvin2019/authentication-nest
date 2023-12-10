import { Body, Controller, HttpStatus, Post, Headers, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto, LoginErrorResponseDto } from './auth.dto';
import { Public } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
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


  @Post('logout')
  async logout(@Headers() headers) {
    const token = headers.authorization.split(' ')[1];
    return  await this.authService.logout(token);
  }
}
