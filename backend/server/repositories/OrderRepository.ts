import { db } from '../config/database';
import { Order, TrackingEvent } from '../../../shared/types';

export interface OrderEntity extends Order {
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class OrderRepository {
  public async findById(id: string): Promise<OrderEntity | null> {
    const orders = db.getCollection<OrderEntity>('orders');
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  public async findByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = db.getCollection<OrderEntity>('orders');
    return orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  public async findBySellerId(sellerId: string): Promise<OrderEntity[]> {
    const orders = db.getCollection<OrderEntity>('orders');
    return orders
      .filter((o) => o.items.some((item) => item.product?.seller?.id === sellerId))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  public async findAll(): Promise<OrderEntity[]> {
    const orders = db.getCollection<OrderEntity>('orders');
    return [...orders].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  public async create(userId: string, orderData: Order): Promise<OrderEntity> {
    const now = new Date().toISOString();
    const newOrder: OrderEntity = {
      ...orderData,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await db.updateCollection<OrderEntity>('orders', (orders) => {
      orders.unshift(newOrder);
    });

    return newOrder;
  }

  public async update(id: string, updates: Partial<OrderEntity>): Promise<OrderEntity | null> {
    let updated: OrderEntity | null = null;

    await db.updateCollection<OrderEntity>('orders', (orders) => {
      const idx = orders.findIndex((o) => o.id === id || o.orderNumber === id);
      if (idx !== -1) {
        orders[idx] = {
          ...orders[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        updated = orders[idx];
      }
    });

    return updated;
  }

  public async addTrackingEvent(id: string, event: TrackingEvent): Promise<OrderEntity | null> {
    let updated: OrderEntity | null = null;

    await db.updateCollection<OrderEntity>('orders', (orders) => {
      const idx = orders.findIndex((o) => o.id === id || o.orderNumber === id);
      if (idx !== -1) {
        // Mark previous current event as completed
        const updatedEvents = orders[idx].trackingEvents.map((e) => ({
          ...e,
          current: false,
        }));
        updatedEvents.push({ ...event, current: true, completed: true });

        orders[idx] = {
          ...orders[idx],
          trackingEvents: updatedEvents,
          updatedAt: new Date().toISOString(),
        };
        updated = orders[idx];
      }
    });

    return updated;
  }
}

export const orderRepository = new OrderRepository();
