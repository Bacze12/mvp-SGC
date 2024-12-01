import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, price, stock } = req.body;
            
            if (!name || !price || stock === undefined) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Missing required fields: name, price, stock'
                });
                return;
            }

            if (price < 0 || stock < 0) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Price and stock must be positive numbers'
                });
                return;
            }

            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await this.productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await this.productService.getProductById(req.params.id);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await this.productService.updateProduct(req.params.id, req.body);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const success = await this.productService.deleteProduct(req.params.id);
            if (!success) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { quantity } = req.body;
            
            if (quantity === undefined) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Quantity is required'
                });
                return;
            }

            if (!Number.isInteger(quantity)) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Quantity must be an integer'
                });
                return;
            }

            const product = await this.productService.updateStock(req.params.id, quantity);
            if (!product) {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Product not found'
                });
                return;
            }

            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }
}
