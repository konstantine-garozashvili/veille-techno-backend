import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateListDto {
  @Field()
  @ApiProperty({ 
    description: 'Title of the Kanban list (e.g., "To Do", "In Progress", "Done")',
    example: 'À faire',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @MinLength(1)
  title!: string;
}