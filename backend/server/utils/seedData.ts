import { CATEGORIES, PRODUCTS, SAMPLE_ADDRESSES, SAMPLE_ORDERS } from '../../../frontend/src/data/mockData';
import { hashPassword } from './crypto';

export function getInitialSeedData() {
  const defaultPasswordHash = hashPassword('buyzo@2026');

  const users = [
    {
      id: 'user-shopper-tejal',
      fullName: 'Tejal Patil',
      email: 'tejal.patil@example.com',
      phone: '9820145678',
      passwordHash: defaultPasswordHash,
      role: 'customer',
      avatarLetter: 'T',
      isVip: true,
      city: 'Mumbai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    },
    {
      id: 'usr-rahul-sharma',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      passwordHash: defaultPasswordHash,
      role: 'customer',
      avatarLetter: 'R',
      isVip: false,
      city: 'Mumbai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    },
    {
      id: 'user-seller-priya',
      fullName: 'Priya Patel',
      email: 'priya.patel@apexretail.in',
      phone: '9823456789',
      passwordHash: defaultPasswordHash,
      role: 'seller',
      avatarLetter: 'P',
      isVip: true,
      sellerStoreName: 'Apex Electronics & Fashion Hub',
      gstin: '27AADCB2230M1Z2',
      city: 'Mumbai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    },
    {
      id: 'user-admin-vikram',
      fullName: 'Vikram Singh',
      email: 'admin.vikram@buyzo.in',
      phone: '9912345678',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      avatarLetter: 'V',
      isVip: true,
      city: 'Bangalore',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    },
  ];

  const products = PRODUCTS.map((p) => ({
    ...p,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
  }));

  const categories = CATEGORIES.map((c) => ({
    ...c,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const addresses = SAMPLE_ADDRESSES.map((a, idx) => ({
    ...a,
    userId: 'user-shopper-tejal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
  }));

  const orders = SAMPLE_ORDERS.map((o) => ({
    ...o,
    userId: 'user-shopper-tejal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const carts = [
    {
      id: 'cart-user-shopper-tejal',
      userId: 'user-shopper-tejal',
      items: [
        {
          product: PRODUCTS.find((p) => p.id === 'prod-kohinoor-rice-5kg') || PRODUCTS[3],
          quantity: 1,
        },
      ],
      updatedAt: new Date().toISOString(),
    },
  ];

  const payments = [
    {
      id: 'tx-initial-1',
      orderId: SAMPLE_ORDERS[0]?.id || 'ord-10921',
      userId: 'user-shopper-tejal',
      amount: SAMPLE_ORDERS[0]?.totalAmount || 4999,
      method: 'UPI',
      subMethod: 'Google Pay',
      status: 'Success',
      transactionRef: 'TXN-BZ-89412345',
      bankRef: 'RRN-458912304918',
      upiVpa: 'tejal@okhdfcbank',
      timestamp: '19 Aug, 04:30 PM',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    users,
    products,
    categories,
    addresses,
    orders,
    carts,
    payments,
  };
}
