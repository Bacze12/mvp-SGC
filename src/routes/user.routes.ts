import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'test-secret', (err: any, user: any) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        res.status(201).json({
            email: req.body.email,
            role: req.body.role
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        res.status(200).json([]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

export default router;
