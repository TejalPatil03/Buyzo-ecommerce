import { Router } from 'express';
import { paymentController } from '../../controllers/PaymentController';
import { optionalAuthMiddleware } from '../../middlewares/auth';

const router = Router();

router.post('/process', optionalAuthMiddleware, (req, res, next) => paymentController.processPayment(req, res, next));

export default router;
