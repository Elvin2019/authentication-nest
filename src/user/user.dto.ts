import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssw0rd',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must meet the requirements.',
  })
  readonly password: string;
}
