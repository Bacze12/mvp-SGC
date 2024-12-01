import { Request, Response } from 'express';
import { SaleService } from '../services/sale.service';

const saleService = new SaleService();

export class SaleController {
    async createSale(req: Request, res: Response) {
        try {
            const { productId, quantity } = req.body;
            const sale = await saleService.createSale(productId, quantity);
            res.status(201).json(sale);
        } catch (error) {
            res.status(400).json({ error: (error as any).message });
        }
    }

    async getAllSales(req: Request, res: Response) {
        const sales = await saleService.getAllSales();
        res.status(200).json(sales);
    }

    async getSaleById(req: Request, res: Response) {
        const sale = await saleService.getSaleById(req.params.id);
        if (!sale) {
            res.status(404).json({ error: 'Sale not found' });
            return;
        }
        res.status(200).json(sale);
    }
}
