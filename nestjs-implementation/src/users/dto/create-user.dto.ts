import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @Field()
  @ApiProperty({ description: 'User password (min 8 chars)', example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password!: string;
}