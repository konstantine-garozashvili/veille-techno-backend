import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  @ApiProperty({ 
    description: 'Valid email address for the new user account',
    example: 'john.doe@company.com',
    format: 'email',
    uniqueItems: true
  })
  @IsEmail()
  email!: string;

  @Field()
  @ApiProperty({ 
    description: 'Strong password with minimum 8 characters (should include letters, numbers, and special characters)',
    example: 'SecurePass123!',
    minLength: 8,
    format: 'password'
  })
  @IsString()
  @MinLength(8)
  password!: string;
}