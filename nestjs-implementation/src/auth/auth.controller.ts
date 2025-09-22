import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiBearerAuth, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenBlacklistService } from './token-blacklist.service';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ 
    description: 'Register a new user', 
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
  @ApiConflictResponse({
    description: 'User already exists',
    example: {
      message: 'Un utilisateur avec cet email existe déjà',
      error: 'Conflict',
      statusCode: 409
    }
  })
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ 
    description: 'Login and receive JWT', 
    type: LoginResponseDto,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        email: 'admin@example.com',
        roles: ['admin']
      }
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
    description: 'Invalid credentials',
    example: {
      message: 'Identifiants invalides',
      error: 'Unauthorized',
      statusCode: 401
    }
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ 
    description: 'Logout and invalidate JWT token',
    example: {
      message: 'Successfully logged out'
    }
  })
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    const token = this.tokenBlacklistService.extractTokenFromHeader(authHeader as string);
    
    if (token) {
      this.tokenBlacklistService.blacklistToken(token);
    }
    
    return { message: 'Successfully logged out' };
  }
}