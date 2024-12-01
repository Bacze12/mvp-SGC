import { Router, Request, Response, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserService } from '../services/user.service';

const router = Router();
const userService = new UserService();
const authController = new AuthController(userService);

const registerHandler: RequestHandler = async (req, res, next) => {
    try {
        await authController.register(req, res);
    } catch (error) {
        next(error);
    }
};

const loginHandler: RequestHandler = async (req, res, next) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        next(error);
    }
};

router.post('/register', registerHandler);
router.post('/login', loginHandler);

export default router;
