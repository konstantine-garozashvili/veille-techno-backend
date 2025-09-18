import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCardDto extends PartialType(CreateCardDto) {
  @Field({ nullable: true })
  @ApiPropertyOptional({ description: 'Card title', example: 'Implement feature - Updated', minLength: 1 })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: 'Card description', example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ description: 'Position index within the list', example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}