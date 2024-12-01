declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: 'admin' | 'cashier';
      email: string;
      isActive: boolean;
      lastLogin?: Date;
    }
  }
}