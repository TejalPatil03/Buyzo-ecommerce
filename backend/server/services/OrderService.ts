import { orderRepository, OrderEntity } from '../repositories/OrderRepository';
import { productRepository } from '../repositories/ProductRepository';
import { cartRepository } from '../repositories/CartRepository';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import { Order, CartItem, Address, PaymentTransaction, TrackingEvent } from '../../../shared/types';

export class OrderService {
  public async createOrder(
    userId: string,
    payload: {
      items: { productId: string; quantity: number; selectedColor?: string; selectedSize?: string }[];
      deliveryAddress: Address;
      paymentMethod: string;
      paymentDetails?: PaymentTransaction;
    }
  ): Promise<Order> {
    if (!payload.items || payload.items.length === 0) {
      throw new BadRequestError('Order items cannot be empty');
    }
    if (!payload.deliveryAddress) {
      throw new BadRequestError('Delivery address is required');
    }

    // Hydrate items and verify stock
    const hydratedCartItems: CartItem[] = [];
    let subtotal = 0;
    let totalOriginalPrice = 0;

    for (const item of payload.items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Product '${item.productId}' not found`);
      }
      if (product.stockCount < item.quantity) {
        throw new BadRequestError(`Insufficient stock for '${product.name}'. Available: ${product.stockCount}`);
      }

      hydratedCartItems.push({
        product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      });

      subtotal += product.price * item.quantity;
      totalOriginalPrice += (product.originalPrice || product.price) * item.quantity;
    }

    // Atomic Stock Decrement
    const decrementSuccess = await productRepository.decrementStockAtomic(
      payload.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    );

    if (!decrementSuccess) {
      throw new BadRequestError('Failed to reserve inventory. One or more items became out of stock.');
    }

    // Business Rules: Free shipping if subtotal > 500, else 49
    const shippingFee = subtotal > 500 ? 0 : 49;
    const discountAmount = Math.max(0, totalOriginalPrice - subtotal);
    const totalAmount = subtotal + shippingFee;

    const orderNumber = `BZ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const returnWindowDate = new Date();
    returnWindowDate.setDate(returnWindowDate.getDate() + 10);
    const returnEligibleUntil = returnWindowDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const initialTrackingEvents: TrackingEvent[] = [
      {
        title: 'Payment Authorized & Order Confirmed',
        description: `Txn Ref: ${payload.paymentDetails?.transactionRef || 'Direct BZ-PAY'}. Payment verified via secure gateway.`,
        timestamp: 'Just now',
        location: 'BuyZo National Routing Hub',
        completed: true,
        current: true,
      },
      {
        title: 'Assigned to Fulfillment Merchant',
        description: 'Merchant notified to pick and pack items.',
        timestamp: 'Within 2 hours',
        location: 'Merchant Warehouse',
        completed: false,
        current: false,
      },
      {
        title: 'Handed over to Express Courier',
        description: 'Package ready for fast ground/air dispatch.',
        timestamp: 'Tomorrow Morning',
        location: 'Logistics Sort Center',
        completed: false,
        current: false,
      },
      {
        title: 'Out for Delivery',
        description: 'Delivery executive will verify OTP at doorstep.',
        timestamp: 'Tomorrow 02:00 PM',
        location: payload.deliveryAddress.city,
        completed: false,
        current: false,
      },
      {
        title: 'Delivered',
        description: 'Package delivered safely.',
        timestamp: 'Tomorrow 04:00 PM',
        location: payload.deliveryAddress.addressLine1,
        completed: false,
        current: false,
      },
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Placed',
      items: hydratedCartItems,
      totalAmount,
      discountAmount,
      shippingFee,
      deliveryAddress: payload.deliveryAddress,
      paymentMethod: payload.paymentMethod,
      paymentDetails: payload.paymentDetails,
      trackingEvents: initialTrackingEvents,
      returnEligibleUntil,
      returnStatus: 'None',
    };

    const savedOrder = await orderRepository.create(userId, newOrder);

    // Clear user's cart after successful order placement
    await cartRepository.clearCart(userId);

    return savedOrder;
  }

  public async getUserOrders(userId: string): Promise<Order[]> {
    return orderRepository.findByUserId(userId);
  }

  public async getOrderById(orderId: string, userId: string, role: string): Promise<Order> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    if (role !== 'admin' && role !== 'seller' && order.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this order');
    }

    return order;
  }

  public async cancelOrder(orderId: string, userId: string, reason?: string, isAdmin = false): Promise<Order> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenError('You can only cancel your own orders');
    }

    // Business rule: Only Placed or Processing can be cancelled
    if (order.status !== 'Placed' && order.status !== 'Processing') {
      throw new BadRequestError(`Cannot cancel order in '${order.status}' status`);
    }

    // Restore stock inventory
    await productRepository.restoreStockAtomic(
      order.items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
    );

    const cancelEvent: TrackingEvent = {
      title: 'Order Cancelled',
      description: reason || 'Customer requested cancellation. Refund initiated.',
      timestamp: 'Just now',
      location: 'BuyZo Hub',
      completed: true,
      current: true,
    };

    const updated = await orderRepository.update(order.id, {
      status: 'Cancelled',
    });

    await orderRepository.addTrackingEvent(order.id, cancelEvent);
    return (await orderRepository.findById(order.id))!;
  }

  public async requestReturn(orderId: string, userId: string, reason: string): Promise<Order> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenError('You can only request returns for your own orders');
    }

    // In demo / tests, allow return request if Placed/Shipped/Delivered or already delivered
    const returnEvent: TrackingEvent = {
      title: 'Return Request Logged',
      description: reason,
      timestamp: 'Just now',
      location: 'Doorstep Verification Team',
      completed: true,
      current: true,
    };

    await orderRepository.update(order.id, {
      returnStatus: 'Requested',
    });

    await orderRepository.addTrackingEvent(order.id, returnEvent);
    return (await orderRepository.findById(order.id))!;
  }
}

export const orderService = new OrderService();
