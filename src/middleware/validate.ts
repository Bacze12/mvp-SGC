import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: any) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await schema.validate(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
        return;
    }
};