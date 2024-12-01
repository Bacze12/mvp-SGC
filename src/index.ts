import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import saleRoutes from './routes/sale.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();


export const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
app.use('/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
