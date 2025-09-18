import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCardDto {
  @Field()
  @ApiProperty({ description: 'Card title', example: 'Implement feature', minLength: 1 })
  @IsString()
  @MinLength(1)
  title!: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: 'Card description', example: 'Detailed steps to implement the feature' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ description: 'Position index within the list', example: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}