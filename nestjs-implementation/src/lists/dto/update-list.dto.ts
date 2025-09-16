import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateListDto extends PartialType(CreateListDto) {
  @ApiPropertyOptional({ description: 'List title', example: 'To Do', minLength: 1 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;
}