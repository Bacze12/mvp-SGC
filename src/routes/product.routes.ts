import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { productSchema, stockUpdateSchema } from '../schema/product.schema';

const router = Router();
const productController = new ProductController();

router.get('/', 
    AuthMiddleware.authenticate,
    (req, res, next) => productController.getAllProducts(req, res, next)
);

router.get('/:id', 
    AuthMiddleware.authenticate,
    (req, res, next) => productController.getProductById(req, res, next)
);

router.post('/', 
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(['admin']),
    validateRequest(productSchema),
    (req, res, next) => productController.createProduct(req, res, next)
);

router.put('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(['admin']),
    (req, res, next) => productController.updateProduct(req, res, next)
);

router.delete('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(['admin']),
    (req, res, next) => productController.deleteProduct(req, res, next)
);

router.patch('/:id/stock',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(['admin', 'cashier']),
    validateRequest(stockUpdateSchema),
    (req, res, next) => productController.updateStock(req, res, next)
);

export default router;
