import { Sale } from '../models/sale.model';
import { ProductService } from './product.service';

const sales: Sale[] = []; // Simulación de base de datos
const productService = new ProductService();

export class SaleService {
    async createSale(productId: string, quantity: number): Promise<Sale | null> {
        const product = await productService.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        const totalPrice = product.price * quantity;

        // Reducir el stock
        await productService.updateStock(productId, -quantity);

        const sale: Sale = {
            id: Date.now().toString(),
            productId,
            quantity,
            totalPrice,
            date: new Date(),
        };

        sales.push(sale);
        return sale;
    }

    async getAllSales(): Promise<Sale[]> {
        return sales;
    }

    async getSaleById(id: string): Promise<Sale | undefined> {
        return sales.find((sale) => sale.id === id);
    }
}
