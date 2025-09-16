import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { List } from '../lists/list.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('cards')
export class Card {
  @ApiProperty({ description: 'Card unique identifier', example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Card title', example: 'Implement feature' })
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @ApiProperty({ description: 'Card description', example: 'Detailed steps to implement the feature', nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Position index within the list', example: 0, minimum: 0 })
  @Column({ type: 'int', default: 0 })
  position!: number;

  @ApiHideProperty()
  @ManyToOne(() => List, { onDelete: 'CASCADE' })
  list!: List;

  @ApiProperty({ description: 'Creation date', example: '2025-01-01T12:00:00.000Z', type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date', example: '2025-01-02T12:00:00.000Z', type: String, format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}