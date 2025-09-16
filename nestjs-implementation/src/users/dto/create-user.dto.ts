import { IsEmail, IsString, MinLength, IsOptional, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  roles?: string[];
}