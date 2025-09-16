import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './list.entity';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([List])],
  controllers: [ListsController],
  providers: [ListsService],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}