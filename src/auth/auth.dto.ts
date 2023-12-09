import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty({
    description: 'password',
    example: 'P@ssw0rd',
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
