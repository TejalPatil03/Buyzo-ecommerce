import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { addressService } from '../services/AddressService';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpCodes';

export class AddressController {
  public async getAddresses(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await addressService.getAddresses(req.user.id);
      return sendSuccess(res, addresses);
    } catch (err) {
      next(err);
    }
  }

  public async getAddressById(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.getAddressById(req.user.id, req.params.id);
      return sendSuccess(res, { address });
    } catch (err) {
      next(err);
    }
  }

  public async createAddress(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.addAddress(req.user.id, req.body);
      return sendSuccess(res, { address }, 'Address created successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  public async updateAddress(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
      return sendSuccess(res, { address }, 'Address updated successfully');
    } catch (err) {
      next(err);
    }
  }

  public async deleteAddress(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      await addressService.deleteAddress(req.user.id, req.params.id);
      return sendSuccess(res, { success: true }, 'Address deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const addressController = new AddressController();
