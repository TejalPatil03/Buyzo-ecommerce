import { db } from '../config/database';
import { PaymentTransaction } from '../../../shared/types';

export class PaymentService {
  public async processPayment(
    userId: string,
    payload: {
      amount: number;
      method: PaymentTransaction['method'];
      subMethod?: string;
      upiVpa?: string;
      cardLast4?: string;
      bankName?: string;
    }
  ): Promise<PaymentTransaction> {
    const transactionRef = `TXN-BZ-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const bankRef = `RRN-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const now = new Date().toLocaleTimeString('en-IN');

    const tx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      orderId: `ord-${Date.now()}`,
      amount: payload.amount,
      method: payload.method,
      subMethod: payload.subMethod,
      status: 'Success',
      transactionRef,
      bankRef,
      upiVpa: payload.upiVpa,
      cardLast4: payload.cardLast4,
      bankName: payload.bankName,
      timestamp: now,
    };

    await db.updateCollection('payments', (payments) => {
      payments.push({ ...tx, userId, createdAt: new Date().toISOString() });
    });

    return tx;
  }
}

export const paymentService = new PaymentService();
