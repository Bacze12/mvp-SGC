import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../index';

const generateToken = (role: 'admin' | 'cashier') => {
    const payload = {
        id: 'test-id',
        role,
        email: 'test@example.com',
        isActive: true,
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
};

describe('Product Endpoints', () => {
    let adminToken: string;
    let cashierToken: string;

    beforeAll(() => {
        adminToken = generateToken('admin');
        cashierToken = generateToken('cashier');
    });

    it('should create a new product', async () => {
        const res = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Product',
                description: 'This is a test',
                price: 100,
                stock: 10,
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Test Product');
    });

    it('should fetch all products', async () => {
        const res = await request(app)
            .get('/products')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should update product stock', async () => {
        const productRes = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Stock Product', price: 50, stock: 20 });

        const res = await request(app)
            .patch(`/products/${productRes.body.id}/stock`)
            .set('Authorization', `Bearer ${cashierToken}`)
            .send({ quantity: 5 });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('stock', 25);
    });
});
