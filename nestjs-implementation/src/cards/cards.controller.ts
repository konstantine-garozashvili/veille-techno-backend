import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
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
  @ApiParam({ name: 'listId', type: String })
  @ApiBody({ type: CreateCardDto })
  @ApiCreatedResponse({ description: 'Card created', type: Card })
  create(@Param('listId') listId: string, @Body() dto: CreateCardDto) {
    return this.cardsService.create(listId, dto);
  }

  @Get()
  @ApiParam({ name: 'listId', type: String })
  @ApiOkResponse({ description: 'List cards in a list', type: [Card] })
  findAll(@Param('listId') listId: string) {
    return this.cardsService.findAll(listId);
  }

  @Get(':cardId')
  @ApiParam({ name: 'listId', type: String })
  @ApiParam({ name: 'cardId', type: String })
  @ApiOkResponse({ description: 'Get a card', type: Card })
  findOne(@Param('listId') listId: string, @Param('cardId') cardId: string) {
    return this.cardsService.findOne(listId, cardId);
  }

  @Patch(':cardId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiParam({ name: 'listId', type: String })
  @ApiParam({ name: 'cardId', type: String })
  @ApiBody({ type: UpdateCardDto })
  @ApiOkResponse({ description: 'Update a card', type: Card })
  update(@Param('listId') listId: string, @Param('cardId') cardId: string, @Body() dto: UpdateCardDto) {
    return this.cardsService.update(listId, cardId, dto);
  }

  @Delete(':cardId')
  @ApiParam({ name: 'listId', type: String })
  @ApiParam({ name: 'cardId', type: String })
  @ApiOkResponse({ description: 'Delete a card', schema: { example: { deleted: true } } })
  remove(@Param('listId') listId: string, @Param('cardId') cardId: string) {
    return this.cardsService.remove(listId, cardId);
  }
}