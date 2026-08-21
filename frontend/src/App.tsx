/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PRODUCTS, SAMPLE_ORDERS, SAMPLE_ADDRESSES } from './data/mockData';
import { Product, Order, Address, CartItem, AppView, UserRole, Category, UserProfile, PaymentTransaction } from './types';
import { api } from './services/api';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { SearchResultsScreen } from './components/SearchResultsScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { AIAssistantScreen } from './components/AIAssistantScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { AuthScreen } from './components/AuthScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { OrderDetailScreen } from './components/OrderDetailScreen';
import { SellerDashboardScreen } from './components/SellerDashboardScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { ProfileScreen } from './components/ProfileScreen';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [previousView, setPreviousView] = useState<AppView>('home');
  const [userRole, setUserRole] = useState<UserRole>('customer');

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'user-shopper-tejal',
    fullName: 'Tejal Patil',
    email: 'tejal.patil@example.com',
    phone: '9820145678',
    role: 'customer',
    avatarLetter: 'T',
    isVip: true,
    city: 'Mumbai',
  });

  // Domain State
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS.find((p) => p.id === 'prod-kohinoor-rice-5kg') || PRODUCTS[3], quantity: 1 },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-titan-watch']);

  // Selected Entities & Temporary checkout/payment state
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    PRODUCTS.find((p) => p.id === 'prod-sony-wh1000xm5') || PRODUCTS[0]
  );
  const [selectedOrder, setSelectedOrder] = useState<Order>(SAMPLE_ORDERS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assistantPrompt, setAssistantPrompt] = useState<string>('');
  const [checkoutSelectedAddress, setCheckoutSelectedAddress] = useState<Address>(SAMPLE_ADDRESSES[0]);
  const [checkoutInitialPaymentMethod, setCheckoutInitialPaymentMethod] = useState<string>('UPI');

  // Initial Data Sync with Backend API
  useEffect(() => {
    async function initData() {
      try {
        // 1. Fetch catalog products
        const fetchedProducts = await api.products.getProducts().catch(() => null);
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }

        // 2. Fetch authenticated profile if token exists
        const token = api.auth.getToken();
        if (token) {
          const profileData = await api.auth.getMe().catch(() => null);
          if (profileData?.user) {
            setCurrentUser(profileData.user);
            setUserRole(profileData.user.role);
          }
        }

        // 3. Fetch addresses
        const fetchedAddresses = await api.addresses.getAddresses().catch(() => null);
        if (fetchedAddresses && fetchedAddresses.length > 0) {
          setAddresses(fetchedAddresses);
          setCheckoutSelectedAddress(fetchedAddresses[0]);
        }

        // 4. Fetch orders
        const fetchedOrders = await api.orders.getOrders().catch(() => null);
        if (fetchedOrders && fetchedOrders.length > 0) {
          setOrders(fetchedOrders);
          setSelectedOrder(fetchedOrders[0]);
        }

        // 5. Fetch cart
        const fetchedCart = await api.cart.getCart().catch(() => null);
        if (fetchedCart && fetchedCart.length > 0) {
          setCart(fetchedCart);
        }
      } catch (err) {
        console.warn('Backend sync initialized in fallback/offline mode:', err);
      }
    }

    initData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Background API Sync
    api.cart.addItem(product.id, 1).catch(() => {});
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );

    // Background API Sync
    api.cart.updateQuantity(productId, delta).catch(() => {});
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    api.cart.removeItem(productId).catch(() => {});
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  // Navigation handlers
  const navigateTo = (view: AppView) => {
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('product-detail');
  };

  const handleSelectCategory = (category: Category) => {
    setSearchQuery(category.name);
    navigateTo('search');
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    navigateTo('search');
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    navigateTo('checkout');
  };

  const handleAskAIAboutProduct = (product: Product) => {
    setAssistantPrompt(`Tell me more about ${product.name} and compare it with alternatives`);
    navigateTo('assistant');
  };

  // Checkout -> Payment flow
  const handleProceedToPayment = (address: Address, initialMethod: string) => {
    setCheckoutSelectedAddress(address);
    setCheckoutInitialPaymentMethod(initialMethod);
    navigateTo('payment');
  };

  const handlePaymentComplete = (transaction: PaymentTransaction, newOrder: Order) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
      if (exists) return prev;
      return [newOrder, ...prev];
    });
    setSelectedOrder(newOrder);
    setCart([]);

    // Background API Sync
    api.orders.createOrder({
      items: newOrder.items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      deliveryAddress: newOrder.deliveryAddress,
      paymentMethod: newOrder.paymentMethod,
      paymentDetails: transaction,
    }).catch(() => {});
  };

  const handleDirectPlaceOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
      if (exists) return prev;
      return [newOrder, ...prev];
    });
    setSelectedOrder(newOrder);
    setCart([]);
  };

  // Order Lifecycle handlers
  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              trackingEvents: [
                ...o.trackingEvents,
                {
                  title: 'Order Cancelled',
                  description: 'Customer requested cancellation. Refund initiated.',
                  timestamp: 'Just now',
                  location: 'BuyZo Hub',
                  completed: true,
                  current: true,
                },
              ],
            }
          : o
      )
    );
    if (selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: 'Cancelled' }));
    }

    // Background API Sync
    api.orders.cancelOrder(orderId).catch(() => {});
  };

  const handleRequestReturn = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              returnStatus: 'Requested',
              trackingEvents: [
                ...o.trackingEvents,
                {
                  title: 'Return Request Logged',
                  description: reason,
                  timestamp: 'Just now',
                  location: 'Doorstep Verification Team',
                  completed: true,
                  current: true,
                },
              ],
            }
          : o
      )
    );
    if (selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, returnStatus: 'Requested' }));
    }

    // Background API Sync
    api.orders.requestReturn(orderId, reason).catch(() => {});
  };

  const handleApproveReturn = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              returnStatus: 'Approved & Refunded',
              trackingEvents: [
                ...o.trackingEvents,
                {
                  title: 'Return Approved & Refund Credited',
                  description: 'Refund credited back to original payment method.',
                  timestamp: 'Just now',
                  location: 'Finance Clearance Hub',
                  completed: true,
                  current: true,
                },
              ],
            }
          : o
      )
    );

    // Background API Sync
    api.admin.approveReturn(orderId).catch(() => {});
  };

  const handleRejectReturn = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              returnStatus: 'Rejected - Policy Non-Compliant',
            }
          : o
      )
    );

    // Background API Sync
    api.admin.rejectReturn(orderId, 'Policy Non-Compliant').catch(() => {});
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stockCount: newStock, inStock: newStock > 0 }
          : p
      )
    );

    // Background API Sync
    api.seller.updateStock(productId, newStock).catch(() => {});
  };

  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);

    // Background API Sync
    api.seller.addProduct(newProduct).catch(() => {});
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // Background API Sync
    api.seller.updateOrderStatus(orderId, newStatus).catch(() => {});
  };

  // Auth Handlers
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setUserRole(user.role);
    if (user.role === 'seller') {
      navigateTo('seller-dashboard');
    } else if (user.role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('home');
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    setUserRole('customer');
    navigateTo('home');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Public_Sans'] antialiased selection:bg-[#dce9ff] selection:text-[#004ac6]">
      {/* Fixed Header */}
      <TopAppBar
        currentView={currentView}
        setCurrentView={navigateTo}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        userRole={userRole}
        setUserRole={setUserRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onBack={() => {
          if (currentView === 'product-detail' || currentView === 'search') {
            navigateTo('home');
          } else if (currentView === 'checkout') {
            navigateTo('cart');
          } else if (currentView === 'payment') {
            navigateTo('checkout');
          } else if (currentView === 'order-detail') {
            navigateTo('orders');
          } else if (currentView === 'auth') {
            navigateTo(previousView || 'home');
          } else {
            navigateTo(previousView || 'home');
          }
        }}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <HomeScreen
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectCategory={handleSelectCategory}
            setCurrentView={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentView === 'auth' && (
          <AuthScreen
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => navigateTo(previousView || 'home')}
          />
        )}

        {currentView === 'search' && (
          <SearchResultsScreen
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            setCurrentView={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailScreen
            product={selectedProduct}
            onAddToCart={(p) => handleAddToCart(p)}
            onBuyNow={handleBuyNow}
            setCurrentView={navigateTo}
            onBack={() => navigateTo('home')}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAskAIAboutProduct={handleAskAIAboutProduct}
          />
        )}

        {currentView === 'assistant' && (
          <AIAssistantScreen
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            setCurrentView={navigateTo}
            initialPrompt={assistantPrompt}
          />
        )}

        {currentView === 'cart' && (
          <CartScreen
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            setCurrentView={navigateTo}
            onProceedToCheckout={() => navigateTo('checkout')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutScreen
            cart={cart}
            addresses={addresses}
            onAddAddress={(newAddr) => {
              setAddresses((prev) => [newAddr, ...prev]);
              api.addresses.addAddress(newAddr).catch(() => {});
            }}
            onProceedToPayment={handleProceedToPayment}
            onPlaceOrderSuccess={handleDirectPlaceOrderSuccess}
            setCurrentView={navigateTo}
            onBack={() => navigateTo('cart')}
          />
        )}

        {currentView === 'payment' && (
          <PaymentScreen
            cart={cart}
            deliveryAddress={checkoutSelectedAddress}
            initialMethod={checkoutInitialPaymentMethod}
            onPaymentComplete={handlePaymentComplete}
            onPaymentSuccess={handleDirectPlaceOrderSuccess}
            setCurrentView={navigateTo}
            onBack={() => navigateTo('checkout')}
          />
        )}

        {currentView === 'orders' && (
          <OrdersScreen
            orders={orders}
            onSelectOrder={(ord) => {
              setSelectedOrder(ord);
              navigateTo('order-detail');
            }}
            onAddToCart={handleAddToCart}
            setCurrentView={navigateTo}
          />
        )}

        {currentView === 'order-detail' && selectedOrder && (
          <OrderDetailScreen
            order={selectedOrder}
            onBack={() => navigateTo('orders')}
            onCancelOrder={handleCancelOrder}
            onRequestReturn={handleRequestReturn}
            setCurrentView={navigateTo}
          />
        )}

        {currentView === 'seller-dashboard' && (
          <SellerDashboardScreen
            products={products}
            orders={orders}
            onUpdateProductStock={handleUpdateProductStock}
            onAddNewProduct={handleAddNewProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            setCurrentView={navigateTo}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardScreen
            products={products}
            orders={orders}
            onApproveReturn={handleApproveReturn}
            onRejectReturn={handleRejectReturn}
            setCurrentView={navigateTo}
          />
        )}

        {currentView === 'profile' && (
          <ProfileScreen
            currentUser={currentUser}
            userRole={userRole}
            setUserRole={setUserRole}
            addresses={addresses}
            wishlistProducts={wishlistProducts}
            onSelectProduct={handleSelectProduct}
            setCurrentView={navigateTo}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (Visible on mobile/tablet) */}
      <BottomNavBar currentView={currentView} setCurrentView={navigateTo} />
    </div>
  );
}
