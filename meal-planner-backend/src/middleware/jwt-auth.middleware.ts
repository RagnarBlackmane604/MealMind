import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7, authHeader.length);
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        req['user'] = { userId: decoded.sub };
        next();
      } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
      }
    } else {
      res.status(401).json({ message: 'No Token Provided' });
    }
  }
}
