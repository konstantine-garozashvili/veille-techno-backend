import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ArrayNotEmpty, IsString, IsEmail, MinLength, ArrayMinSize, ArrayMaxSize, IsEnum } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Role } from '../role.enum';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field({ nullable: true })
  @ApiPropertyOptional({ description: 'User email address', example: 'updated@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: 'New password (min 8 chars)', example: 'NewPassword123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @Field(() => [String], { nullable: true })
  @ApiPropertyOptional({ description: 'Exactly one user role', example: ['admin'], isArray: true, type: String, minItems: 1, maxItems: 1, enum: Role })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @IsEnum(Role, { each: true })
  roles?: string[];
}