export interface Seller {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  city: string;
}

export interface Review {
  id: string;
  author: string;
  isVerifiedBuyer: boolean;
  rating: number;
  comment: string;
  date: string;
  avatarLetter: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Fashion' | 'Mobiles' | 'Home' | 'Beauty' | 'Grocery' | 'Electronics';
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  ratingCount: number;
  image: string;
  additionalImages?: string[];
  seller: Seller;
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isLimitedStock?: boolean;
  deliveryTimeText: string;
  description: string;
  specifications: Record<string, string>;
  reviews: Review[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'Home' | 'Work' | 'Other';
}

export interface TrackingEvent {
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarLetter: string;
  isVip: boolean;
  sellerStoreName?: string;
  gstin?: string;
  city?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: 'UPI' | 'Card' | 'NetBanking' | 'COD' | 'Wallet' | 'PayLater';
  subMethod?: string;
  status: 'Success' | 'Processing' | 'Failed';
  transactionRef: string;
  bankRef?: string;
  upiVpa?: string;
  cardLast4?: string;
  bankName?: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentDetails?: PaymentTransaction;
  trackingEvents: TrackingEvent[];
  returnEligibleUntil: string;
  returnStatus?: 'None' | 'Requested' | 'Approved' | 'PickedUp' | 'Refunded';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  suggestions?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount: number;
}

export type AppView = 
  | 'home'
  | 'search'
  | 'product-detail'
  | 'assistant'
  | 'cart'
  | 'checkout'
  | 'payment'
  | 'orders'
  | 'order-detail'
  | 'profile'
  | 'wishlist'
  | 'auth'
  | 'seller-dashboard'
  | 'admin-dashboard';

export type UserRole = 'customer' | 'seller' | 'admin';

