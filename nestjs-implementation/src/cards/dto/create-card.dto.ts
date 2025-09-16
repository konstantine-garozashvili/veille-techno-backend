import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ description: 'Card title', example: 'Implement feature', minLength: 1 })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({ description: 'Card description', example: 'Detailed steps to implement the feature' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Position index within the list', example: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}