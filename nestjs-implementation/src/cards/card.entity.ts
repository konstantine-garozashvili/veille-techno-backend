import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { List } from '../lists/list.entity'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { ObjectType, Field, ID, Int } from '@nestjs/graphql'

@ObjectType()
@Entity('cards')
export class Card {
  @Field(() => ID)
  @ApiProperty({ description: 'Card unique identifier', example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @ApiProperty({ description: 'Card title', example: 'Implement feature' })
  @Column({ type: 'varchar', length: 255 })
  title!: string

  @Field({ nullable: true })
  @ApiProperty({ description: 'Card description', example: 'Detailed steps to implement the feature', nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string

  @Field(() => Int)
  @ApiProperty({ description: 'Position index within the list', example: 0, minimum: 0 })
  @Column({ type: 'int', default: 0 })
  position!: number

  @ApiHideProperty()
  @ManyToOne(() => List, { onDelete: 'CASCADE' })
  list!: List

  @Field()
  @ApiProperty({ description: 'Creation date', example: '2025-01-01T12:00:00.000Z', type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @Field()
  @ApiProperty({ description: 'Last update date', example: '2025-01-02T12:00:00.000Z', type: String, format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date
}