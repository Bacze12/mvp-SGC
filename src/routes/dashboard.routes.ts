import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const dashboardController = new DashboardController();
const router = Router();

router.get('/sales-summary', AuthMiddleware.authenticate, dashboardController.getSalesSummary);
router.get('/top-products', AuthMiddleware.authenticate, dashboardController.getTopProducts);
router.get('/inventory-status', AuthMiddleware.authenticate, dashboardController.getInventoryStatus);

export default router;
