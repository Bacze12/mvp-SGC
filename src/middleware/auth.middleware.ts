import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  role: 'admin' | 'cashier';
  email: string;
  isActive: boolean;
  lastLogin?: Date;
}

export class AuthMiddleware {
  private static validateToken(token: string): JWTPayload {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
  }

  static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'Authentication token is required' 
        });
        return;
      }

      const token = authHeader.split(' ')[1];
      const payload = AuthMiddleware.validateToken(token);
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'Invalid token' 
        });
        return;
      }
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Authentication failed' 
      });
    }
  }

  static authorize(allowedRoles: ('admin' | 'cashier')[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          res.status(401).json({ 
            error: 'Unauthorized',
            message: 'User not authenticated' 
          });
          return;
        }

        if (!allowedRoles.includes(req.user.role)) {
          res.status(403).json({ 
            error: 'Forbidden',
            message: 'Insufficient permissions' 
          });
          return;
        }

        next();
      } catch (error) {
        res.status(500).json({ 
          error: 'Internal Server Error',
          message: 'Authorization failed' 
        });
      }
    };
  }
}
