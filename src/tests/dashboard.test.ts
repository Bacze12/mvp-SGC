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

describe('Dashboard Endpoints', () => {
    let adminToken: string;

    beforeAll(() => {
        adminToken = generateToken('admin');
    });

    it('should fetch sales summary', async () => {
        const res = await request(app)
            .get('/dashboard/sales-summary')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('totalSales');
        expect(res.body).toHaveProperty('totalRevenue');
    });

    it('should fetch top products', async () => {
        const res = await request(app)
            .get('/dashboard/top-products')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should fetch inventory status', async () => {
        const res = await request(app)
            .get('/dashboard/inventory-status')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
