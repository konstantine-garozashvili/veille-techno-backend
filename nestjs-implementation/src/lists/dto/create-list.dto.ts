import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty({ description: 'List title', example: 'Backlog', minLength: 1 })
  @IsString()
  @MinLength(1)
  title!: string;
}