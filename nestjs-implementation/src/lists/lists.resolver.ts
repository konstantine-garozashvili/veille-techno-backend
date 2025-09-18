import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './list.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => List)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Query(() => [List])
  lists() {
    return this.listsService.findAll();
  }

  @Query(() => List)
  list(@Args('id') id: string) {
    return this.listsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => List)
  createList(@Args('input') input: CreateListDto) {
    return this.listsService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => List)
  updateList(@Args('id') id: string, @Args('input') input: UpdateListDto) {
    return this.listsService.update(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeList(@Args('id') id: string) {
    await this.listsService.remove(id);
    return true;
  }
}