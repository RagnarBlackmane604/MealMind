import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'; // Oder dein JWT-Bibliothek

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7, authHeader.length);
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET aus ConfigService holen!
        // WICHTIG: Hier wird req.user befüllt
        req['user'] = { userId: decoded.sub }; // Oder wie dein Payload aussieht
        next();
      } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
      }
    } else {
      res.status(401).json({ message: 'No Token Provided' });
    }
  }
}
