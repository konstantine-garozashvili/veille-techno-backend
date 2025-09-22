import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from './card.entity';
import { List } from '../lists/list.entity';
import { CardsResolver } from './cards.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List]), AuthModule],
  controllers: [CardsController],
  providers: [CardsService, CardsResolver],
  exports: [CardsService, TypeOrmModule],
})
export class CardsModule {}