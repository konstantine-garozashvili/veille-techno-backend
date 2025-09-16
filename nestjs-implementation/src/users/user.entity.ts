import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: 'User unique identifier', example: 'c0ffee12-3456-7890-abcd-ef1234567890', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Unique email address', example: 'user@example.com' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @ApiHideProperty()
  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @ApiProperty({ description: 'User roles', example: ['user'], isArray: true, type: String })
  // Store roles as a simple CSV string; defaults to 'user'
  @Column('simple-array', { default: 'user' })
  roles!: string[];

  @ApiProperty({ description: 'Creation date', example: '2025-01-01T12:00:00.000Z', type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date', example: '2025-01-02T12:00:00.000Z', type: String, format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}