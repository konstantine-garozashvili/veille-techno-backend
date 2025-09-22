import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the list',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    format: 'uuid'
  })
  id!: string;

  @ApiProperty({ 
    description: 'Title of the Kanban list',
    example: 'À faire',
    maxLength: 100
  })
  title!: string;

  @ApiProperty({ 
    description: 'Cards in this list',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string' },
        position: { type: 'number' }
      }
    },
    example: []
  })
  cards!: any[];

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time'
  })
  createdAt!: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time'
  })
  updatedAt!: Date;
}