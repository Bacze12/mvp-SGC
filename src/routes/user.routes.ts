import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createUserSchema } from '../schema/user.schema';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validate';

const router = express.Router();
const userController = new UserController();

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

router.post('/', 
    authenticateToken, 
    validate(createUserSchema),
    userController.createUser
);

router.get('/', authenticateToken, userController.getUsers);

router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

export default router;
