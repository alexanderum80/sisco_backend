import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

export const DEFAULT_GRAPHQL_CONTEXT = 'usuario';
export const SECRET_KEY = 'TiendasCaribe1994';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        if (!ctx.req.headers.authorization) {
            return false;
        }

        this.validateToken(ctx.req.headers.authorization).then(token => {
            ctx[DEFAULT_GRAPHQL_CONTEXT] = token;
        });
        return true;
    }

    async validateToken(auth: string): Promise<any> {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Token Inválido', HttpStatus.UNAUTHORIZED);
        }

        const token = auth.split(' ')[1];
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (err: any) {
            throw new HttpException('Token Inválido', HttpStatus.UNAUTHORIZED);
        }
    }

}