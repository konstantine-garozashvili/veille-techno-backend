import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './token-blacklist.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '1h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthResolver, TokenBlacklistService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, TokenBlacklistService, JwtAuthGuard],
})
export class AuthModule {}