import { Router } from 'express';
import { cartController } from '../../controllers/CartController';
import { authMiddleware } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validator';
import { validateAddToCart, validateUpdateCartItem } from '../../validators/cartValidators';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => cartController.getCart(req, res, next));
router.post('/items', validateBody(validateAddToCart), (req, res, next) => cartController.addItem(req, res, next));
router.put('/items/:productId', validateBody(validateUpdateCartItem), (req, res, next) => cartController.updateQuantity(req, res, next));
router.delete('/items/:productId', (req, res, next) => cartController.removeItem(req, res, next));
router.delete('/', (req, res, next) => cartController.clearCart(req, res, next));

export default router;
