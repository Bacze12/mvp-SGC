import { Sale } from '../models/sale.model';
import { Product } from '../models/product.model';

export class DashboardService {
    constructor(
        private sales: Sale[],
        private products: Product[]
    ) {}

    async getSalesSummary(): Promise<{ totalSales: number; totalRevenue: number }> {
        const totalSales = this.sales.length;
        const totalRevenue = this.sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
        return { totalSales, totalRevenue };
    }

    async getTopProducts(): Promise<{ productId: string; name: string; totalSold: number }[]> {
        const productSales = this.sales.reduce((acc, sale) => {
            acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
            return acc;
        }, {} as Record<string, number>);

        const topProducts = Object.entries(productSales)
            .map(([productId, totalSold]) => {
                const product = this.products.find((p) => p.id === productId);
                return { productId, name: product?.name || 'Unknown', totalSold };
            })
            .sort((a, b) => b.totalSold - a.totalSold);

        return topProducts;
    }

    async getInventoryStatus(): Promise<{ productId: string; name: string; stock: number }[]> {
        return this.products.map((product) => ({
            productId: product.id,
            name: product.name,
            stock: product.stock,
        }));
    }
}
