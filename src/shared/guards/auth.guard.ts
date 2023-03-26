import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { DEFAULT_GRAPHQL_CONTEXT, SECRET_KEY } from '../models/jwt.model';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.req.headers.authorization) {
      return false;
    }

    const auth = ctx.req.headers.authorization;

    if (auth.split(' ')[0] !== 'Bearer') return false;

    const token = auth.split(' ')[1];

    let decryptedToken;

    try {
      decryptedToken = jwt.verify(token, SECRET_KEY);
    } catch (err: any) {
      return false;
    }

    ctx[DEFAULT_GRAPHQL_CONTEXT] = decryptedToken;

    return true;
  }
}
