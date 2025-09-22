import { ApiProperty } from '@nestjs/swagger';

export class CardResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the card',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  id!: string;

  @ApiProperty({ 
    description: 'Title of the card',
    example: 'Implémenter l\'authentification utilisateur',
    maxLength: 200
  })
  title!: string;

  @ApiProperty({ 
    description: 'Detailed description of the card',
    example: 'Créer un système d\'authentification avec JWT',
    required: false
  })
  description?: string;

  @ApiProperty({ 
    description: 'Position of the card in the list (0-based)',
    example: 0,
    minimum: 0
  })
  position!: number;

  @ApiProperty({ 
    description: 'ID of the list containing this card',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    format: 'uuid'
  })
  listId!: string;

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2024-01-15T11:00:00.000Z',
    format: 'date-time'
  })
  createdAt!: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2024-01-15T11:00:00.000Z',
    format: 'date-time'
  })
  updatedAt!: Date;
}