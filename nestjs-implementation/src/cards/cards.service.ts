import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { List } from '../lists/list.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private readonly cardRepo: Repository<Card>,
    @InjectRepository(List) private readonly listRepo: Repository<List>
  ) {}

  async create(listId: string, dto: CreateCardDto) {
    const list = await this.listRepo.findOne({ where: { id: listId } });
    if (!list) throw new NotFoundException('List not found');
    const card = this.cardRepo.create({ ...dto, position: dto.position ?? 0, list });
    return this.cardRepo.save(card);
  }

  findAll(listId: string) {
    return this.cardRepo.find({ where: { list: { id: listId } }, order: { position: 'ASC', createdAt: 'ASC' } });
  }

  async findOne(listId: string, cardId: string) {
    const card = await this.cardRepo.findOne({ where: { id: cardId, list: { id: listId } } });
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async update(listId: string, cardId: string, dto: UpdateCardDto) {
    const card = await this.findOne(listId, cardId);
    Object.assign(card, dto);
    return this.cardRepo.save(card);
  }

  async remove(listId: string, cardId: string) {
    const card = await this.findOne(listId, cardId);
    await this.cardRepo.remove(card);
    return { deleted: true };
  }
}