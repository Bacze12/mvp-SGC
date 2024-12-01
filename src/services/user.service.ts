import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { ValidationError, NotFoundError, ConflictError } from '../errors/app-errors';

export const users: User[] = [];

export class UserService {
    private validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        return users.some(u => u.email === email && u.id !== excludeId);
    }

    async createUser(email: string, password: string, role: 'admin' | 'cashier'): Promise<Omit<User, 'password'>> {
        if (!email || !password || !role) {
            throw new ValidationError('Missing required fields');
        }

        if (!this.validateEmail(email)) {
            throw new ValidationError('Invalid email format');
        }

        if (password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
        }

        if (await this.isEmailTaken(email)) {
            throw new ConflictError('Email already exists');
        }

        try {
            const salt = Number(process.env.BCRYPT_SALT) || 10;
            const hashedPassword = await bcrypt.hash(password, salt);
            const user: User = {
                id: Date.now().toString(),
                email,
                password: hashedPassword,
                role,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                lastLogin: undefined
            };
            users.push(user);
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    async getUsers(): Promise<Omit<User, 'password'>[]> {
        return users.map(({ password: _, ...rest }) => rest);
    }

    async getUserById(id: string): Promise<Omit<User, 'password'>> {
        const user = users.find((u) => u.id === id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'password'>>): Promise<Omit<User, 'password'>> {
        const user = users.find((u) => u.id === id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (updates.email) {
            if (!this.validateEmail(updates.email)) {
                throw new ValidationError('Invalid email format');
            }
            if (await this.isEmailTaken(updates.email, id)) {
                throw new ConflictError('Email already exists');
            }
        }

        Object.assign(user, updates, { updatedAt: new Date() });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async deleteUser(id: string): Promise<void> {
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new NotFoundError('User not found');
        }
        users.splice(index, 1);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return users.find(u => u.email === email);
    }

    async updateLastLogin(id: string): Promise<void> {
        const user = users.find(u => u.id === id);
        if (user) {
            user.lastLogin = new Date();
        }
    }
}
