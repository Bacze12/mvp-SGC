import request from 'supertest';
import {app} from '../index';

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('email', 'test@example.com');
    });

    it('should login the user and return a token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should reject login with invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'wrong@example.com',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toEqual(401);
    });
});
