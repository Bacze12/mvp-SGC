import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { Sale } from '../models/sale.model';
import { Product } from '../models/product.model';

const sales: Sale[] = []; // Simulación de ventas
const products: Product[] = []; // Simulación de productos
const dashboardService = new DashboardService(sales, products);

export class DashboardController {
    async getSalesSummary(req: Request, res: Response) {
        const summary = await dashboardService.getSalesSummary();
        res.status(200).json(summary);
    }

    async getTopProducts(req: Request, res: Response) {
        const topProducts = await dashboardService.getTopProducts();
        res.status(200).json(topProducts);
    }

    async getInventoryStatus(req: Request, res: Response) {
        const inventoryStatus = await dashboardService.getInventoryStatus();
        res.status(200).json(inventoryStatus);
    }
}
