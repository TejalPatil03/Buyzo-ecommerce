import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { adminService } from '../services/AdminService';
import { sendSuccess } from '../utils/response';

export class AdminController {
  public async getKPIs(_req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getKPIs();
      return sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }

  public async getReturns(_req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const returns = await adminService.getReturns();
      return sendSuccess(res, returns);
    } catch (err) {
      next(err);
    }
  }

  public async approveReturn(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const order = await adminService.approveReturn(orderId);
      return sendSuccess(res, { order }, 'Return approved and refund credited');
    } catch (err) {
      next(err);
    }
  }

  public async rejectReturn(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;
      const order = await adminService.rejectReturn(orderId, reason);
      return sendSuccess(res, { order }, 'Return request rejected');
    } catch (err) {
      next(err);
    }
  }

  public async getSellers(_req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const sellers = await adminService.getSellers();
      return sendSuccess(res, sellers);
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
