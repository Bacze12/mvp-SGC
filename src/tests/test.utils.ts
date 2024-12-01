import jwt from 'jsonwebtoken';
import { Server } from 'http';
import { app } from '../index';

let server: Server;

export async function setupTestUser(): Promise<string> {
    const testUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'admin'
    };

    return jwt.sign(testUser, process.env.JWT_SECRET || 'test-secret');
}

export function setupTestServer(): Server {
    server = app.listen(0); // Use random available port
    return server;
}

export function closeTestServer(): Promise<void> {
    return new Promise((resolve) => {
        server?.close(() => resolve());
    });
}
