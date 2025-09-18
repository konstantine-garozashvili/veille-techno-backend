import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    // Support both REST and GraphQL requests
    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx?.getContext?.()?.req ?? context.switchToHttp().getRequest();
    const user = req?.user as { roles?: string[] } | undefined;

    if (!user?.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('Access denied: no roles on user');
    }

    const has = required.some(r => user.roles!.includes(r));
    if (!has) throw new ForbiddenException('Access denied: insufficient role');
    return true;
  }
}