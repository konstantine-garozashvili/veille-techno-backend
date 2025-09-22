import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListResponseDto } from './dto/list-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { List } from './list.entity';

@ApiTags('lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: CreateListDto })
  @ApiCreatedResponse({ 
    description: 'Create a new list', 
    type: ListResponseDto,
    example: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      title: 'À faire',
      cards: [],
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z'
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    example: {
      message: ['title must be longer than or equal to 1 characters'],
      error: 'Bad Request',
      statusCode: 400
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
    example: {
      message: 'Unauthorized',
      statusCode: 401
    }
  })
  create(@Body() dto: CreateListDto) {
    return this.listsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ 
    description: 'Get all lists', 
    type: [ListResponseDto],
    example: [
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        title: 'À faire',
        cards: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      },
      {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        title: 'En cours',
        cards: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Implémenter l\'authentification',
            description: 'Créer le système JWT',
            position: 0
          }
        ],
        createdAt: '2024-01-15T10:05:00.000Z',
        updatedAt: '2024-01-15T11:30:00.000Z'
      }
    ]
  })
  findAll() {
    return this.listsService.findAll();
  }

  @Get(':id')
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiOkResponse({ 
    description: 'Get a list', 
    type: ListResponseDto,
    example: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      title: 'À faire',
      cards: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Créer la base de données',
          description: 'Configurer PostgreSQL et les migrations',
          position: 0
        }
      ],
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T12:15:00.000Z'
    }
  })
  findOne(@Param('id') id: string) {
    return this.listsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiBody({ type: UpdateListDto })
  @ApiOkResponse({ 
    description: 'Update a list', 
    type: ListResponseDto,
    example: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      title: 'Terminé',
      cards: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Authentification complétée',
          description: 'Système JWT implémenté avec succès',
          position: 0
        }
      ],
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T16:30:00.000Z'
    }
  })
  update(@Param('id') id: string, @Body() dto: UpdateListDto) {
    return this.listsService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiOkResponse({ 
    description: 'Delete a list', 
    example: { 
      message: 'Liste supprimée avec succès',
      deleted: true 
    }
  })
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }
}