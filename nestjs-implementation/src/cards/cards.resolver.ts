import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Card)
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

  @Query(() => [Card])
  cards(@Args('listId') listId: string) {
    return this.cardsService.findAll(listId);
  }

  @Query(() => Card)
  card(@Args('listId') listId: string, @Args('cardId') cardId: string) {
    return this.cardsService.findOne(listId, cardId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Card)
  createCard(@Args('listId') listId: string, @Args('input') input: CreateCardDto) {
    return this.cardsService.create(listId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Card)
  updateCard(
    @Args('listId') listId: string,
    @Args('cardId') cardId: string,
    @Args('input') input: UpdateCardDto,
  ) {
    return this.cardsService.update(listId, cardId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeCard(@Args('listId') listId: string, @Args('cardId') cardId: string) {
    await this.cardsService.remove(listId, cardId);
    return true;
  }
}