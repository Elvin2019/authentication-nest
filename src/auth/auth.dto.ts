import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email',
    example: '4gDpH@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty({
    description: 'password',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginErrorResponseDto {
  @ApiProperty()
  response: string;
  @ApiProperty()
  statusCode: number;
}
