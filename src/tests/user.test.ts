import request from 'supertest';
import { app } from '../index';
import { setupTestUser, setupTestServer, closeTestServer } from './test.utils';

describe('User Endpoints', () => {
    let authToken: string;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        process.env.JWT_SECRET = 'test-secret';
        setupTestServer();
        authToken = await setupTestUser();
    });

    afterAll(async () => {
        await closeTestServer();
    });

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('email', 'admin@example.com');
    });

    it('should fetch all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
