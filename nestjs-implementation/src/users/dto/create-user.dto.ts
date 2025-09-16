import { IsEmail, IsString, MinLength, IsOptional, ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User password (min 8 chars)', example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ description: 'User roles', example: ['user', 'admin'], isArray: true, type: String, minItems: 1 })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles?: string[];
}