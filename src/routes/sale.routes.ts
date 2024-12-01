import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { saleSchema } from '../schema/sale.schema';



const saleController = new SaleController();
const router = Router();

router.post('/', AuthMiddleware.authenticate, validateRequest(saleSchema), saleController.createSale);
router.get('/', AuthMiddleware.authenticate, saleController.getAllSales);
router.get('/:id', AuthMiddleware.authenticate, saleController.getSaleById);

export default router;
