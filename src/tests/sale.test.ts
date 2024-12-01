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

describe('Sale Endpoints', () => {
    let productId: string;
    let adminToken: string;
    let cashierToken: string;

    beforeAll(async () => {
        adminToken = generateToken('admin');
        cashierToken = generateToken('cashier');

        const productRes = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Product',
                description: 'For sale testing',
                price: 100,
                stock: 10,
            });
        productId = productRes.body.id;
    });

    it('should create a new sale', async () => {
        const res = await request(app)
            .post('/sales')
            .set('Authorization', `Bearer ${cashierToken}`)
            .send({ productId, quantity: 2 });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('totalPrice', 200);
    });

    it('should reject sale if insufficient stock', async () => {
        const res = await request(app)
            .post('/sales')
            .set('Authorization', `Bearer ${cashierToken}`)
            .send({ productId, quantity: 20 });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Insufficient stock');
    });

    it('should fetch all sales', async () => {
        const res = await request(app)
            .get('/sales')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
