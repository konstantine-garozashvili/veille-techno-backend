import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ArrayNotEmpty, IsString, IsEmail, MinLength, ArrayMinSize, ArrayMaxSize, IsEnum } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Role } from '../role.enum';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field({ nullable: true })
  @ApiPropertyOptional({ 
    description: 'New email address for the user (must be unique)',
    example: 'jane.smith@company.com',
    format: 'email'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ 
    description: 'New password (minimum 8 characters with letters, numbers, and special characters)',
    example: 'NewSecurePass456!',
    minLength: 8,
    format: 'password'
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @Field(() => [String], { nullable: true })
  @ApiPropertyOptional({ 
    description: 'User role assignment (exactly one role: "user" or "admin")',
    example: ['admin'],
    isArray: true,
    type: String,
    minItems: 1,
    maxItems: 1,
    enum: Role
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @IsEnum(Role, { each: true })
  roles?: string[];
}