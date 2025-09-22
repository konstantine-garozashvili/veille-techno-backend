import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { List } from './list.entity';
import { ListsResolver } from './lists.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), AuthModule],
  controllers: [ListsController],
  providers: [ListsService, ListsResolver],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}