import { cartRepository } from '../repositories/CartRepository';
import { productRepository } from '../repositories/ProductRepository';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { CartItem } from '../../../shared/types';

export class CartService {
  public async getCart(userId: string): Promise<CartItem[]> {
    const cart = await cartRepository.findByUserId(userId);
    return cart.items || [];
  }

  public async addItem(
    userId: string,
    productId: string,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ): Promise<CartItem[]> {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product '${productId}' not found`);
    }

    if (product.stockCount < 1) {
      throw new BadRequestError(`Product '${product.name}' is currently out of stock`);
    }

    const currentCart = await cartRepository.findByUserId(userId);
    const items = [...currentCart.items];
    const existingIndex = items.findIndex((i) => i.product.id === productId);

    if (existingIndex !== -1) {
      const newQty = items[existingIndex].quantity + quantity;
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: newQty,
        selectedColor: selectedColor || items[existingIndex].selectedColor,
        selectedSize: selectedSize || items[existingIndex].selectedSize,
      };
    } else {
      items.push({
        product,
        quantity,
        selectedColor,
        selectedSize,
      });
    }

    const updated = await cartRepository.saveCart(userId, items);
    return updated.items;
  }

  public async updateItemQuantity(userId: string, productId: string, deltaOrExact: number, isExact = false): Promise<CartItem[]> {
    const currentCart = await cartRepository.findByUserId(userId);
    let items = [...currentCart.items];

    items = items
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = isExact ? deltaOrExact : item.quantity + deltaOrExact;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    const updated = await cartRepository.saveCart(userId, items);
    return updated.items;
  }

  public async removeItem(userId: string, productId: string): Promise<CartItem[]> {
    const currentCart = await cartRepository.findByUserId(userId);
    const items = currentCart.items.filter((i) => i.product.id !== productId);
    const updated = await cartRepository.saveCart(userId, items);
    return updated.items;
  }

  public async clearCart(userId: string): Promise<void> {
    await cartRepository.clearCart(userId);
  }
}

export const cartService = new CartService();
