import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenBlacklistService } from '../token-blacklist.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext) {
    const request = this.getRequest(context);
    const authHeader = request.headers.authorization;
    
    if (authHeader) {
      const token = this.tokenBlacklistService.extractTokenFromHeader(authHeader);
      if (token && this.tokenBlacklistService.isTokenBlacklisted(token)) {
        throw new UnauthorizedException('Token has been invalidated');
      }
    }
    
    return super.canActivate(context);
  }
}