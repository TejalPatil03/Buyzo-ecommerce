import { Router } from 'express';
import { sellerController } from '../../controllers/SellerController';
import { authMiddleware } from '../../middlewares/auth';
import { roleGuard } from '../../middlewares/roleGuard';
import { ROLES } from '../../constants/roles';
import { validateBody } from '../../middlewares/validator';
import { validateProductCreate, validateStockUpdate } from '../../validators/productValidators';

const router = Router();

router.use(authMiddleware);
router.use(roleGuard(ROLES.SELLER, ROLES.ADMIN));

router.get('/products', (req, res, next) => sellerController.getProducts(req, res, next));
router.post('/products', validateBody(validateProductCreate), (req, res, next) => sellerController.addProduct(req, res, next));
router.put('/products/:id/stock', validateBody(validateStockUpdate), (req, res, next) => sellerController.updateStock(req, res, next));
router.get('/orders', (req, res, next) => sellerController.getOrders(req, res, next));
router.put('/orders/:id/status', (req, res, next) => sellerController.updateOrderStatus(req, res, next));
router.get('/analytics', (req, res, next) => sellerController.getAnalytics(req, res, next));

export default router;
