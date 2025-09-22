import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiParam, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ 
    description: 'Create a new user', 
    type: UserResponseDto,
    example: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      email: 'john.doe@company.com',
      roles: ['user'],
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z'
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    example: {
      message: ['email must be a valid email', 'password must be longer than or equal to 8 characters'],
      error: 'Bad Request',
      statusCode: 400
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
    example: {
      message: 'Unauthorized',
      statusCode: 401
    }
  })
  @ApiForbiddenResponse({ 
    description: 'Access denied. Admin role required.',
    example: {
      message: 'Accès refusé. Rôle administrateur requis.',
      error: 'Forbidden',
      statusCode: 403
    }
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ 
    description: 'Get a user', 
    type: UserResponseDto,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'jane.smith@company.com',
      roles: ['user'],
      createdAt: '2024-01-15T14:30:00.000Z',
      updatedAt: '2024-01-15T14:30:00.000Z'
    }
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ 
    description: 'Update a user', 
    type: UserResponseDto,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'jane.updated@company.com',
      roles: ['admin'],
      createdAt: '2024-01-15T14:30:00.000Z',
      updatedAt: '2024-01-15T16:45:00.000Z'
    }
  })
  @ApiForbiddenResponse({ description: 'Access denied: insufficient role' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiParam({ 
    name: 'id', 
    type: String, 
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiOkResponse({ description: 'Delete a user', schema: { example: { deleted: true } } })
  @ApiForbiddenResponse({ description: 'Access denied: insufficient role' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}