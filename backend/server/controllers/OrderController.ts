import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { orderService } from '../services/OrderService';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpCodes';

export class OrderController {
  public async getOrders(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getUserOrders(req.user.id);
      return sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  public async getOrderById(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
      return sendSuccess(res, { order });
    } catch (err) {
      next(err);
    }
  }

  public async createOrder(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrder(req.user.id, req.body);
      return sendSuccess(res, { order }, 'Order placed successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  public async cancelOrder(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const order = await orderService.cancelOrder(id, req.user.id, reason, req.user.role === 'admin');
      return sendSuccess(res, { order }, 'Order cancelled successfully');
    } catch (err) {
      next(err);
    }
  }

  public async requestReturn(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const order = await orderService.requestReturn(id, req.user.id, reason);
      return sendSuccess(res, { order }, 'Return request submitted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
