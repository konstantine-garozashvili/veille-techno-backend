import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('lists')
export class List {
  @ApiProperty({ description: 'List unique identifier', example: 'f2b0c3d4-5678-1234-9abc-def012345678', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'List title', example: 'To Do' })
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @ApiProperty({ description: 'Creation date', example: '2025-01-01T12:00:00.000Z', type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date', example: '2025-01-02T12:00:00.000Z', type: String, format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}