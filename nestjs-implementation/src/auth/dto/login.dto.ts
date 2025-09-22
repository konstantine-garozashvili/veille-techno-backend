import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email address for authentication (Use user55@example.com for testing)',
    example: 'user55@example.com',
    format: 'email'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: 'Password (minimum 8 characters, Use Password123! for testing)',
    example: 'Password123!',
    minLength: 8,
    format: 'password'
  })
  @IsString()
  @MinLength(8)
  password!: string;
}