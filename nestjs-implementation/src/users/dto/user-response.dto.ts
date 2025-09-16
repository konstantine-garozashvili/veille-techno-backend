import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User unique identifier', example: 'a3a0d2b2-0f59-4b55-8a0a-5fba9b1e6a20', format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  email!: string;

  @ApiProperty({ description: 'User roles', example: ['user', 'admin'], isArray: true, type: String })
  roles!: string[];

  @ApiProperty({ description: 'Creation date', example: '2025-01-01T12:00:00.000Z', type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ description: 'Last update date', example: '2025-01-02T12:00:00.000Z', type: String, format: 'date-time' })
  updatedAt!: string | Date;
}