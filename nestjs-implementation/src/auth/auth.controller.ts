import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiOkResponse({ description: 'Register a new user', type: UserResponseDto })
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login and receive JWT', type: LoginResponseDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Logout and invalidate JWT token' })
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    const token = this.tokenBlacklistService.extractTokenFromHeader(authHeader as string);
    
    if (token) {
      this.tokenBlacklistService.blacklistToken(token);
    }
    
    return { message: 'Successfully logged out' };
  }
}