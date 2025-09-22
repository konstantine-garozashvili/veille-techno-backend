import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCardDto extends PartialType(CreateCardDto) {
  @Field({ nullable: true })
  @ApiPropertyOptional({ 
    description: 'Updated title for the card',
    example: 'Finaliser l\'authentification utilisateur',
    minLength: 1,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ 
    description: 'Updated description with additional details or changes',
    example: 'Ajouter la validation des mots de passe forts et implémenter la réinitialisation par email'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ 
    description: 'New position index within the list (for reordering cards)',
    example: 2,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}