export interface User {
    id: string;
    email: string;
    password: string;
    role: 'admin' | 'cashier';
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    lastLogin?: Date;
}

export type UserCreateDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'lastLogin'>;
export type UserUpdateDTO = Partial<Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>>;
export type UserResponse = Omit<User, 'password'>;

