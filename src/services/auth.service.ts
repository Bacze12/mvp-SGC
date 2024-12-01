import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const users: User[] = []; // Simulando una base de datos

export class AuthService {
    async register(email: string, password: string): Promise<Omit<User, 'password'>> {
        try {
            const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
            const user: User = { id: Date.now().toString(), email, password: hashedPassword };
            users.push(user);
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error registering user');
        }
    }

    async login(email: string, password: string): Promise<string> {
        try {
            const user = users.find((u) => u.email === email);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error('Invalid credentials');
            }
            return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        } catch (error) {
            throw new Error('Error logging in');
        }
    }
}
