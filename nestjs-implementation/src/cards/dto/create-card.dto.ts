import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCardDto {
  @Field()
  @ApiProperty({ 
    description: 'Title of the card (brief summary of the task)',
    example: 'Implémenter l\'authentification utilisateur',
    minLength: 1,
    maxLength: 200
  })
  @IsString()
  @MinLength(1)
  title!: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ 
    description: 'Detailed description of the task or requirements',
    example: 'Créer un système d\'authentification avec JWT, validation des emails et gestion des rôles utilisateur/admin'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ 
    description: 'Position index within the list (0 = top, higher numbers = lower position)',
    example: 0,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}