import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Convertir a arrow functions para preservar el contexto
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }
            const user = await this.authService.register(email, password);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Internal server error' });
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }
            const token = await this.authService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(401).json({ message: error?.message || 'Invalid credentials' });
        }
    }
}
