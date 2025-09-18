import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
@Entity('lists')
export class List {
  @Field(() => ID)
  @ApiProperty({ description: 'List unique identifier', example: 'f2b0c3d4-5678-1234-9abc-def012345678', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @ApiProperty({ description: 'List title', example: 'To Do' })
  @Column({ type: 'varchar', length: 255 })
  title!: string

  @Field()
  @ApiProperty({ description: 'Creation date', example: '2025-01-01T12:00:00.000Z', type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @Field()
  @ApiProperty({ description: 'Last update date', example: '2025-01-02T12:00:00.000Z', type: String, format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date
}