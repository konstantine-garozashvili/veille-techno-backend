import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
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
  @ApiCreatedResponse({ description: 'List created', type: List })
  create(@Body() dto: CreateListDto) {
    return this.listsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'List all lists', type: [List] })
  findAll() {
    return this.listsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Get a list', type: List })
  findOne(@Param('id') id: string) {
    return this.listsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Update a list', type: List })
  update(@Param('id') id: string, @Body() dto: UpdateListDto) {
    return this.listsService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Delete a list', schema: { example: { deleted: true } } })
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }
}