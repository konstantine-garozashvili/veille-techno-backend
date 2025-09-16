import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiPropertyOptional({ description: 'Card title', example: 'Implement feature - Updated', minLength: 1 })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Card description', example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Position index within the list', example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}