import { orderRepository } from '../repositories/OrderRepository';
import { productRepository } from '../repositories/ProductRepository';
import { userRepository } from '../repositories/UserRepository';
import { NotFoundError } from '../utils/errors';
import { Order, TrackingEvent } from '../../../shared/types';

export class AdminService {
  public async getKPIs() {
    const orders = await orderRepository.findAll();
    const products = await productRepository.findMany({});
    const sellers = await userRepository.listAllSellers();

    const baseGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingReturns = orders.filter((o) => o.returnStatus === 'Requested');

    return {
      platformGMV: baseGMV + 1420000,
      verifiedSellers: Math.max(sellers.length, 428),
      pendingDisputesCount: pendingReturns.length,
      activeListings: products.total,
    };
  }

  public async getReturns(): Promise<Order[]> {
    const orders = await orderRepository.findAll();
    return orders.filter((o) => o.returnStatus && o.returnStatus !== 'None');
  }

  public async approveReturn(orderId: string): Promise<Order> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    const event: TrackingEvent = {
      title: 'Return Approved & Refund Credited',
      description: 'Super Admin approved return. Refund credited back to original payment method.',
      timestamp: 'Just now',
      location: 'Finance Clearance Hub',
      completed: true,
      current: true,
    };

    await orderRepository.update(order.id, {
      returnStatus: 'Approved & Refunded' as any,
    });
    await orderRepository.addTrackingEvent(order.id, event);

    return (await orderRepository.findById(order.id))!;
  }

  public async rejectReturn(orderId: string, reason = 'Policy Non-Compliant'): Promise<Order> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    const event: TrackingEvent = {
      title: 'Return Rejected',
      description: `Return request rejected: ${reason}`,
      timestamp: 'Just now',
      location: 'Dispute Arbitration Desk',
      completed: true,
      current: true,
    };

    await orderRepository.update(order.id, {
      returnStatus: `Rejected - ${reason}` as any,
    });
    await orderRepository.addTrackingEvent(order.id, event);

    return (await orderRepository.findById(order.id))!;
  }

  public async getSellers() {
    return [
      { id: 'sel-1', name: 'Apex Electronics Hub', city: 'Mumbai', gst: '27AADCB2230M1Z2', status: 'Approved', sales: '₹4,82,000', rating: 4.9 },
      { id: 'sel-2', name: 'MegaMart Daily Supermarket', city: 'Delhi NCR', gst: '07AALCM3918C1Z', status: 'Approved', sales: '₹3,15,400', rating: 4.8 },
      { id: 'sel-3', name: 'Patel Organic Groceries', city: 'Ahmedabad', gst: '24AAACP4912D1Z', status: 'Approved', sales: '₹1,90,000', rating: 4.7 },
      { id: 'sel-4', name: 'Urban Kraft & Fashion', city: 'Jaipur', gst: '08AAFCU2910F1Z', status: 'Under Review', sales: '₹42,000', rating: 4.5 },
      { id: 'sel-5', name: 'Southern Spices & Co', city: 'Bengaluru', gst: '29AAECE8192E1Z', status: 'Under Review', sales: '₹15,000', rating: 4.6 },
    ];
  }
}

export const adminService = new AdminService();
