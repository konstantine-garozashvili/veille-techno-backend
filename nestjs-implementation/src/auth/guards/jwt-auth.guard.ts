import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    if (ctx && ctx.getContext) {
      const gqlReq = ctx.getContext().req;
      if (gqlReq) return gqlReq;
    }
    return context.switchToHttp().getRequest();
  }
}