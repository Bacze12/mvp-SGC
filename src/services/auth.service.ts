import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreateDTO, UserResponse } from '../models/user.model';
import { ValidationError, AuthError } from '../errors/app-errors';
import { UserService } from './user.service';

export class AuthService {
    constructor(private userService: UserService) {}

    async register(userData: UserCreateDTO): Promise<UserResponse> {
        if (!userData.email || !userData.password || !userData.role) {
            throw new ValidationError('Missing required fields');
        }

        try {
            const salt = Number(process.env.BCRYPT_SALT) || 10;
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            return await this.userService.createUser(userData.email, hashedPassword, userData.role);
        } catch (error) {
            throw new AuthError('Error registering user');
        }
    }

    async login(email: string, password: string): Promise<{ token: string; user: UserResponse }> {
        if (!email || !password) {
            throw new ValidationError('Missing credentials');
        }

        const user = await this.userService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AuthError('Invalid credentials');
        }

        if (!user.isActive) {
            throw new AuthError('Account is disabled');
        }

        const token = this.generateToken(user);
        await this.userService.updateLastLogin(user.id);

        const { password: _, ...userResponse } = user;
        return { token, user: userResponse };
    }

    private generateToken(user: User): string {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        return jwt.sign(
            { 
                id: user.id, 
                role: user.role,
                email: user.email 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );
    }
}
