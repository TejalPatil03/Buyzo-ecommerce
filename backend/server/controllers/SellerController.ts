import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { sellerService } from '../services/SellerService';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpCodes';

export class SellerController {
  public async getProducts(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const products = await sellerService.getSellerProducts(req.user.id);
      return sendSuccess(res, products);
    } catch (err) {
      next(err);
    }
  }

  public async addProduct(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const product = await sellerService.addProduct(req.user, req.body);
      return sendSuccess(res, { product }, 'Product added successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  public async updateStock(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { stockCount } = req.body;
      const product = await sellerService.updateStock(id, req.user.id, Number(stockCount));
      return sendSuccess(res, { product }, 'Stock updated successfully');
    } catch (err) {
      next(err);
    }
  }

  public async getOrders(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await sellerService.getSellerOrders(req.user.id);
      return sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  public async updateOrderStatus(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await sellerService.updateOrderStatus(id, req.user.id, status);
      return sendSuccess(res, { order }, 'Order status updated');
    } catch (err) {
      next(err);
    }
  }

  public async getAnalytics(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await sellerService.getAnalytics(req.user.id);
      return sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }
}

export const sellerController = new SellerController();
