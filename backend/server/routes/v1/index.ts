import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import addressRoutes from './addressRoutes';
import orderRoutes from './orderRoutes';
import paymentRoutes from './paymentRoutes';
import sellerRoutes from './sellerRoutes';
import adminRoutes from './adminRoutes';
import assistantRoutes from './assistantRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/seller', sellerRoutes);
router.use('/admin', adminRoutes);
router.use('/assistant', assistantRoutes);

export default router;
