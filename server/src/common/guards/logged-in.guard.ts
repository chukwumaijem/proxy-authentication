import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

import envs from '../../config/app';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { headers } = ctx.req;

    const user = this.verifyToken(headers.authorization);
    if (!user) return false;

    ctx.req.user = user;
    return ctx.req;
  }

  verifyToken(authorization: string) {
    const token = authorization.split(' ')[1];
    if (!token) return false;

    try {
      const result = verify(token, envs.authSecret);
      return result;
    } catch (error) {
      return false;
    }
  }
}
