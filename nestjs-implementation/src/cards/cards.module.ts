import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { List } from '../lists/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List])],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService, TypeOrmModule],
})
export class CardsModule {}