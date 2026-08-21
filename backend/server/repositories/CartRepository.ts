import { db } from '../config/database';
import { CartItem } from '../../../shared/types';

export interface CartEntity {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export class CartRepository {
  public async findByUserId(userId: string): Promise<CartEntity> {
    const carts = db.getCollection<CartEntity>('carts');
    let cart = carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        id: `cart-${userId}`,
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      await db.updateCollection<CartEntity>('carts', (list) => {
        list.push(cart!);
      });
    }
    return cart;
  }

  public async saveCart(userId: string, items: CartItem[]): Promise<CartEntity> {
    let saved: CartEntity;
    await db.updateCollection<CartEntity>('carts', (carts) => {
      const idx = carts.findIndex((c) => c.userId === userId);
      const updated = {
        id: `cart-${userId}`,
        userId,
        items,
        updatedAt: new Date().toISOString(),
      };
      if (idx !== -1) {
        carts[idx] = updated;
      } else {
        carts.push(updated);
      }
      saved = updated;
    });

    return saved!;
  }

  public async clearCart(userId: string): Promise<void> {
    await this.saveCart(userId, []);
  }
}

export const cartRepository = new CartRepository();
