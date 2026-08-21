import { Router } from 'express';
import { adminController } from '../../controllers/AdminController';
import { authMiddleware } from '../../middlewares/auth';
import { roleGuard } from '../../middlewares/roleGuard';
import { ROLES } from '../../constants/roles';

const router = Router();

router.use(authMiddleware);
router.use(roleGuard(ROLES.ADMIN));

router.get('/kpis', (req, res, next) => adminController.getKPIs(req, res, next));
router.get('/returns', (req, res, next) => adminController.getReturns(req, res, next));
router.post('/returns/:orderId/approve', (req, res, next) => adminController.approveReturn(req, res, next));
router.post('/returns/:orderId/reject', (req, res, next) => adminController.rejectReturn(req, res, next));
router.get('/sellers', (req, res, next) => adminController.getSellers(req, res, next));

export default router;
