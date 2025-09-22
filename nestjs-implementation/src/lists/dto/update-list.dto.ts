import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateListDto extends PartialType(CreateListDto) {
  @Field({ nullable: true })
  @ApiPropertyOptional({ 
    description: 'Updated title for the Kanban list',
    example: 'En cours',
    minLength: 1,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;
}