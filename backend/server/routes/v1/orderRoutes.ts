import { Router } from 'express';
import { orderController } from '../../controllers/OrderController';
import { authMiddleware } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validator';
import { validateCreateOrder, validateCancelOrder, validateReturnOrder } from '../../validators/orderValidators';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => orderController.getOrders(req, res, next));
router.get('/:id', (req, res, next) => orderController.getOrderById(req, res, next));
router.post('/', validateBody(validateCreateOrder), (req, res, next) => orderController.createOrder(req, res, next));
router.post('/:id/cancel', validateBody(validateCancelOrder), (req, res, next) => orderController.cancelOrder(req, res, next));
router.post('/:id/return', validateBody(validateReturnOrder), (req, res, next) => orderController.requestReturn(req, res, next));

export default router;
