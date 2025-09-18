import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Role } from './role.enum'

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @Column({ unique: true })
  email!: string

  @ApiProperty({ description: 'Hashed password (never exposed)', example: '***' })
  @Column()
  passwordHash!: string

  @Field(() => [String])
  @ApiProperty({ description: 'User roles', example: ['user'], isArray: true, enum: Role })
  @Column('text', { array: true, default: '{"user"}' })
  roles!: string[]

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}