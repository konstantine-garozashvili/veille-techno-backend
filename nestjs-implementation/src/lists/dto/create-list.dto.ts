import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateListDto {
  @Field()
  @ApiProperty({ description: 'List title', example: 'Backlog', minLength: 1 })
  @IsString()
  @MinLength(1)
  title!: string;
}