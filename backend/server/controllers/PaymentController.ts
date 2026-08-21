import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { paymentService } from '../services/PaymentService';
import { sendSuccess } from '../utils/response';

export class PaymentController {
  public async processPayment(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const transaction = await paymentService.processPayment(req.user?.id || 'guest', req.body);
      return sendSuccess(res, { transaction }, 'Payment processed successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const paymentController = new PaymentController();
