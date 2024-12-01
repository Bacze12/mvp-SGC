import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Sin necesidad de .bind()
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
