import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../errors/app-errors';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password, role } = req.body;
            const user = await this.userService.createUser(email, password, role);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
