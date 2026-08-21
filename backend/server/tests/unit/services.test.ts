import { db } from '../../config/database';
import { productService } from '../../services/ProductService';
import { orderService } from '../../services/OrderService';
import { cartService } from '../../services/CartService';
import { addressService } from '../../services/AddressService';

export async function runServicesTests() {
  console.log('--- Running Domain Services Unit Tests ---');
  await db.init();

  // 1. Test Product Query & Filtering
  const catalog = await productService.getProducts({ category: 'Mobiles' });
  if (catalog.products.length === 0) {
    throw new Error('ProductService failed to fetch Mobiles category');
  }
  console.log(`✓ Product filtering verified (${catalog.products.length} Mobiles found)`);

  // 2. Test Cart Service
  const testUserId = 'user-shopper-tejal';
  const cartItems = await cartService.addItem(testUserId, catalog.products[0].id, 2);
  if (!cartItems.some((i) => i.product.id === catalog.products[0].id && i.quantity >= 2)) {
    throw new Error('CartService failed to add item');
  }
  console.log('✓ Cart operations verified (add, quantity increment)');

  // 3. Test Order Creation & Inventory Lock
  const initialStock = catalog.products[0].stockCount;
  let addresses = await addressService.getAddresses(testUserId);
  let deliveryAddress = addresses[0];
  if (!deliveryAddress) {
    deliveryAddress = await addressService.addAddress(testUserId, {
      fullName: 'Tejal Patil',
      phone: '9820145678',
      addressLine1: 'Flat 402, Sunshine Heights',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      isDefault: true,
      type: 'Home',
    });
  }

  const order = await orderService.createOrder(testUserId, {
    items: [{ productId: catalog.products[0].id, quantity: 1 }],
    deliveryAddress,
    paymentMethod: 'UPI',
  });

  if (!order || !order.orderNumber.startsWith('BZ-')) {
    throw new Error('OrderService failed to create valid order');
  }

  const productAfterOrder = await productService.getProductById(catalog.products[0].id);
  if (productAfterOrder.stockCount !== initialStock - 1) {
    throw new Error(`Inventory stock decrement failed. Expected ${initialStock - 1}, got ${productAfterOrder.stockCount}`);
  }
  console.log(`✓ Order placement and atomic inventory decrement verified (Order: ${order.orderNumber})`);

  // 4. Test Order Cancellation & Stock Restoration
  const cancelledOrder = await orderService.cancelOrder(order.id, testUserId, 'Test cancel');
  if (cancelledOrder.status !== 'Cancelled') {
    throw new Error('Order status not updated to Cancelled');
  }

  const productAfterCancel = await productService.getProductById(catalog.products[0].id);
  if (productAfterCancel.stockCount !== initialStock) {
    throw new Error(`Inventory stock restoration failed. Expected ${initialStock}, got ${productAfterCancel.stockCount}`);
  }
  console.log('✓ Order cancellation and atomic inventory restoration verified');
}
