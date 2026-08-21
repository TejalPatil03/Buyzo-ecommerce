import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { cartService } from '../services/CartService';
import { sendSuccess } from '../utils/response';

export class CartController {
  public async getCart(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const items = await cartService.getCart(req.user.id);
      return sendSuccess(res, { items });
    } catch (err) {
      next(err);
    }
  }

  public async addItem(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { productId, quantity, selectedColor, selectedSize } = req.body;
      const items = await cartService.addItem(req.user.id, productId, quantity || 1, selectedColor, selectedSize);
      return sendSuccess(res, { items }, 'Item added to cart');
    } catch (err) {
      next(err);
    }
  }

  public async updateQuantity(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { quantity, delta } = req.body;

      let items;
      if (quantity !== undefined) {
        items = await cartService.updateItemQuantity(req.user.id, productId, quantity, true);
      } else {
        items = await cartService.updateItemQuantity(req.user.id, productId, delta || 1, false);
      }

      return sendSuccess(res, { items }, 'Cart updated');
    } catch (err) {
      next(err);
    }
  }

  public async removeItem(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const items = await cartService.removeItem(req.user.id, productId);
      return sendSuccess(res, { items }, 'Item removed from cart');
    } catch (err) {
      next(err);
    }
  }

  public async clearCart(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      await cartService.clearCart(req.user.id);
      return sendSuccess(res, { items: [] }, 'Cart cleared');
    } catch (err) {
      next(err);
    }
  }
}

export const cartController = new CartController();
