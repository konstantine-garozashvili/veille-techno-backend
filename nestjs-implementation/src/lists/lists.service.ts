import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './list.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(@InjectRepository(List) private readonly repo: Repository<List>) {}

  async create(dto: CreateListDto) {
    const list = this.repo.create(dto);
    return this.repo.save(list);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: string) {
    const list = await this.repo.findOne({ where: { id } });
    if (!list) throw new NotFoundException('List not found');
    return list;
  }

  async update(id: string, dto: UpdateListDto) {
    const list = await this.findOne(id);
    Object.assign(list, dto);
    return this.repo.save(list);
  }

  async remove(id: string) {
    const list = await this.findOne(id);
    await this.repo.remove(list);
    return { deleted: true };
  }
}