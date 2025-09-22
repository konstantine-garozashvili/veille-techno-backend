import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardResponseDto } from './dto/card-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Card } from './card.entity';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lists/:listId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiParam({ 
    name: 'listId', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiBody({ type: CreateCardDto })
  @ApiCreatedResponse({ 
    description: 'Create a new card', 
    type: CardResponseDto,
    example: {
      id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      title: 'Implémenter l\'authentification utilisateur',
      description: 'Créer un système d\'authentification avec JWT et validation des rôles',
      position: 0,
      listId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
  @ApiNotFoundResponse({
    description: 'List not found',
    example: {
      message: 'Liste non trouvée',
      error: 'Not Found',
      statusCode: 404
    }
  })
  create(@Param('listId') listId: string, @Body() dto: CreateCardDto) {
    return this.cardsService.create(listId, dto);
  }

  @Get()
  @ApiParam({ 
    name: 'listId', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiOkResponse({ 
    description: 'Get all cards in a list', 
    type: [CardResponseDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Implémenter l\'authentification utilisateur',
        description: 'Créer un système d\'authentification avec JWT',
        position: 0,
        listId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        createdAt: '2024-01-15T11:00:00.000Z',
        updatedAt: '2024-01-15T11:00:00.000Z'
      },
      {
        id: '456e7890-e89b-12d3-a456-426614174001',
        title: 'Créer la base de données',
        description: 'Configurer PostgreSQL et les migrations',
        position: 1,
        listId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        createdAt: '2024-01-15T11:15:00.000Z',
        updatedAt: '2024-01-15T11:15:00.000Z'
      }
    ]
  })
  findAll(@Param('listId') listId: string) {
    return this.cardsService.findAll(listId);
  }

  @Get(':cardId')
  @ApiParam({ 
    name: 'listId', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiParam({ 
    name: 'cardId', 
    type: String, 
    description: 'Card unique identifier',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
  })
  @ApiOkResponse({ 
    description: 'Get a card', 
    type: CardResponseDto,
    example: {
      id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      title: 'Implémenter l\'authentification utilisateur',
      description: 'Créer un système d\'authentification avec JWT, validation des emails et gestion des rôles utilisateur/admin',
      position: 0,
      listId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      createdAt: '2024-01-15T11:00:00.000Z',
      updatedAt: '2024-01-15T11:00:00.000Z'
    }
  })
  findOne(@Param('listId') listId: string, @Param('cardId') cardId: string) {
    return this.cardsService.findOne(listId, cardId);
  }

  @Patch(':cardId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiParam({ 
    name: 'listId', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiParam({ 
    name: 'cardId', 
    type: String, 
    description: 'Card unique identifier',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
  })
  @ApiBody({ type: UpdateCardDto })
  @ApiOkResponse({ 
    description: 'Update a card', 
    type: CardResponseDto,
    example: {
      id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      title: 'Finaliser l\'authentification utilisateur',
      description: 'Ajouter la validation des mots de passe forts et implémenter la réinitialisation par email',
      position: 2,
      listId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      createdAt: '2024-01-15T11:00:00.000Z',
      updatedAt: '2024-01-15T15:30:00.000Z'
    }
  })
  update(@Param('listId') listId: string, @Param('cardId') cardId: string, @Body() dto: UpdateCardDto) {
    return this.cardsService.update(listId, cardId, dto);
  }

  @Delete(':cardId')
  @ApiParam({ 
    name: 'listId', 
    type: String, 
    description: 'List unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiParam({ 
    name: 'cardId', 
    type: String, 
    description: 'Card unique identifier',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
  })
  @ApiOkResponse({ 
    description: 'Delete a card', 
    example: { 
      message: 'Carte supprimée avec succès',
      deleted: true 
    }
  })
  remove(@Param('listId') listId: string, @Param('cardId') cardId: string) {
    return this.cardsService.remove(listId, cardId);
  }
}