import { Product, Order, Address, CartItem, UserProfile, Category, PaymentTransaction, UserRole } from '../types';

const API_BASE = '/api/v1';
const TOKEN_KEY = 'buyzo_auth_token';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({
    success: false,
    error: { message: `HTTP ${response.status} ${response.statusText}` },
  }));

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || json.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  auth: {
    getToken(): string | null {
      return localStorage.getItem(TOKEN_KEY);
    },
    setToken(token: string) {
      localStorage.setItem(TOKEN_KEY, token);
    },
    clearToken() {
      localStorage.removeItem(TOKEN_KEY);
    },
    async signup(payload: {
      fullName: string;
      email: string;
      phone: string;
      password?: string;
      role?: UserRole;
      sellerStoreName?: string;
      gstin?: string;
      city?: string;
    }): Promise<{ user: UserProfile; token: string }> {
      const data = await request<{ user: UserProfile; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    },
    async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
      const data = await request<{ user: UserProfile; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    },
    async sendOtp(identifier: string, method = 'phone'): Promise<{ message: string }> {
      return request<{ message: string }>('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier, method }),
      });
    },
    async verifyOtp(payload: {
      identifier: string;
      otp: string;
      role?: UserRole;
      fullName?: string;
      city?: string;
      sellerStoreName?: string;
      gstin?: string;
    }): Promise<{ user: UserProfile; token: string }> {
      const data = await request<{ user: UserProfile; token: string }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    },
    async quickDemo(role: UserRole): Promise<{ user: UserProfile; token: string }> {
      const data = await request<{ user: UserProfile; token: string }>('/auth/quick-demo', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    },
    async getMe(): Promise<{ user: UserProfile }> {
      return request<{ user: UserProfile }>('/auth/me');
    },
    logout() {
      localStorage.removeItem(TOKEN_KEY);
    },
  },

  products: {
    async getProducts(params: {
      q?: string;
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      sort?: string;
      page?: number;
      limit?: number;
    } = {}): Promise<Product[]> {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.set('q', params.q);
      if (params.category && params.category !== 'All') searchParams.set('category', params.category);
      if (params.brand) searchParams.set('brand', params.brand);
      if (params.minPrice !== undefined) searchParams.set('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined) searchParams.set('maxPrice', String(params.maxPrice));
      if (params.inStock) searchParams.set('inStock', 'true');
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));

      const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<Product[]>(`/products${queryStr}`);
    },
    async getProductById(id: string): Promise<Product> {
      const data = await request<{ product: Product }>(`/products/${id}`);
      return data.product;
    },
    async getCategories(): Promise<Category[]> {
      return request<Category[]>('/products/categories');
    },
  },

  cart: {
    async getCart(): Promise<CartItem[]> {
      const data = await request<{ items: CartItem[] }>('/cart');
      return data.items || [];
    },
    async addItem(productId: string, quantity = 1, selectedColor?: string, selectedSize?: string): Promise<CartItem[]> {
      const data = await request<{ items: CartItem[] }>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, selectedColor, selectedSize }),
      });
      return data.items || [];
    },
    async updateQuantity(productId: string, delta: number): Promise<CartItem[]> {
      const data = await request<{ items: CartItem[] }>(`/cart/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ delta }),
      });
      return data.items || [];
    },
    async removeItem(productId: string): Promise<CartItem[]> {
      const data = await request<{ items: CartItem[] }>(`/cart/items/${productId}`, {
        method: 'DELETE',
      });
      return data.items || [];
    },
    async clearCart(): Promise<void> {
      await request('/cart', { method: 'DELETE' });
    },
  },

  addresses: {
    async getAddresses(): Promise<Address[]> {
      return request<Address[]>('/addresses');
    },
    async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
      const data = await request<{ address: Address }>('/addresses', {
        method: 'POST',
        body: JSON.stringify(address),
      });
      return data.address;
    },
    async updateAddress(id: string, address: Partial<Address>): Promise<Address> {
      const data = await request<{ address: Address }>(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(address),
      });
      return data.address;
    },
    async deleteAddress(id: string): Promise<void> {
      await request(`/addresses/${id}`, { method: 'DELETE' });
    },
  },

  orders: {
    async getOrders(): Promise<Order[]> {
      return request<Order[]>('/orders');
    },
    async getOrderById(id: string): Promise<Order> {
      const data = await request<{ order: Order }>(`/orders/${id}`);
      return data.order;
    },
    async createOrder(payload: {
      items: { productId: string; quantity: number; selectedColor?: string; selectedSize?: string }[];
      deliveryAddress: Address;
      paymentMethod: string;
      paymentDetails?: PaymentTransaction;
    }): Promise<Order> {
      const data = await request<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data.order;
    },
    async cancelOrder(id: string, reason?: string): Promise<Order> {
      const data = await request<{ order: Order }>(`/orders/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return data.order;
    },
    async requestReturn(id: string, reason: string): Promise<Order> {
      const data = await request<{ order: Order }>(`/orders/${id}/return`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return data.order;
    },
  },

  payments: {
    async processPayment(payload: {
      amount: number;
      method: PaymentTransaction['method'];
      subMethod?: string;
      upiVpa?: string;
      cardLast4?: string;
      bankName?: string;
    }): Promise<PaymentTransaction> {
      const data = await request<{ transaction: PaymentTransaction }>('/payments/process', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data.transaction;
    },
  },

  seller: {
    async getProducts(): Promise<Product[]> {
      return request<Product[]>('/seller/products');
    },
    async addProduct(product: Partial<Product>): Promise<Product> {
      const data = await request<{ product: Product }>('/seller/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      return data.product;
    },
    async updateStock(productId: string, stockCount: number): Promise<Product> {
      const data = await request<{ product: Product }>(`/seller/products/${productId}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ stockCount }),
      });
      return data.product;
    },
    async getOrders(): Promise<Order[]> {
      return request<Order[]>('/seller/orders');
    },
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
      const data = await request<{ order: Order }>(`/seller/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return data.order;
    },
    async getAnalytics(): Promise<{ totalGMV: number; totalOrders: number; activeListings: number; lowStockItems: number }> {
      return request<{ totalGMV: number; totalOrders: number; activeListings: number; lowStockItems: number }>('/seller/analytics');
    },
  },

  admin: {
    async getKPIs(): Promise<{ platformGMV: number; verifiedSellers: number; pendingDisputesCount: number; activeListings: number }> {
      return request<{ platformGMV: number; verifiedSellers: number; pendingDisputesCount: number; activeListings: number }>('/admin/kpis');
    },
    async getReturns(): Promise<Order[]> {
      return request<Order[]>('/admin/returns');
    },
    async approveReturn(orderId: string): Promise<Order> {
      const data = await request<{ order: Order }>(`/admin/returns/${orderId}/approve`, {
        method: 'POST',
      });
      return data.order;
    },
    async rejectReturn(orderId: string, reason: string): Promise<Order> {
      const data = await request<{ order: Order }>(`/admin/returns/${orderId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return data.order;
    },
    async getSellers(): Promise<any[]> {
      return request<any[]>('/admin/sellers');
    },
  },

  assistant: {
    async chat(message: string, catalogContext?: any[]): Promise<{
      reply: string;
      recommendedProductIds: string[];
      suggestions: string[];
    }> {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, catalogContext }),
      });
      const data = await res.json();
      return {
        reply: data.reply || data.data?.reply || '',
        recommendedProductIds: data.recommendedProductIds || data.data?.recommendedProductIds || [],
        suggestions: data.suggestions || data.data?.suggestions || [],
      };
    },
  },
};
