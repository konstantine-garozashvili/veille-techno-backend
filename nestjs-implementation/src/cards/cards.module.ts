import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from './card.entity';
import { List } from '../lists/list.entity';
import { CardsResolver } from './cards.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List])],
  controllers: [CardsController],
  providers: [CardsService, CardsResolver],
  exports: [CardsService, TypeOrmModule],
})
export class CardsModule {}