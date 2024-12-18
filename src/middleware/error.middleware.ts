import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-errors';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }

    console.error(error);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};