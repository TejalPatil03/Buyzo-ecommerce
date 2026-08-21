import { productRepository } from '../repositories/ProductRepository';
import { orderRepository } from '../repositories/OrderRepository';
import { productService } from './ProductService';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { Product, Order, UserProfile, TrackingEvent } from '../../../shared/types';

export class SellerService {
  public async getSellerProducts(sellerId: string): Promise<Product[]> {
    const all = await productRepository.findMany({});
    // In mock/demo mode or specific seller ID match
    const sellerProds = all.products.filter(
      (p) => p.seller?.id === sellerId || p.seller?.name.toLowerCase().includes('apex') || !p.seller?.id
    );
    return sellerProds.length > 0 ? sellerProds : all.products;
  }

  public async addProduct(sellerUser: UserProfile, productData: Partial<Product>): Promise<Product> {
    return productService.createProduct(productData, sellerUser);
  }

  public async updateStock(productId: string, sellerId: string, newStock: number): Promise<Product> {
    return productService.updateStock(productId, sellerId, newStock, false);
  }

  public async getSellerOrders(_sellerId: string): Promise<Order[]> {
    return orderRepository.findAll();
  }

  public async updateOrderStatus(
    orderId: string,
    _sellerId: string,
    newStatus: Order['status']
  ): Promise<Order> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    const event: TrackingEvent = {
      title: `Status Updated to ${newStatus}`,
      description: `Merchant advanced shipment status to ${newStatus}.`,
      timestamp: 'Just now',
      location: 'Merchant Fulfillment Hub',
      completed: true,
      current: true,
    };

    await orderRepository.update(order.id, { status: newStatus });
    await orderRepository.addTrackingEvent(order.id, event);

    return (await orderRepository.findById(order.id))!;
  }

  public async getAnalytics(_sellerId: string) {
    const orders = await orderRepository.findAll();
    const products = await productRepository.findMany({});
    const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalGMV,
      totalOrders: orders.length,
      activeListings: products.total,
      lowStockItems: products.products.filter((p) => p.stockCount < 10).length,
    };
  }
}

export const sellerService = new SellerService();
