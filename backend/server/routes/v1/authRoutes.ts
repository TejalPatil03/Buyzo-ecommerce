import { Router } from 'express';
import { authController } from '../../controllers/AuthController';
import { authMiddleware } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validator';
import {
  validateSignup,
  validateLogin,
  validateSendOtp,
  validateVerifyOtp,
  validateQuickDemo,
} from '../../validators/authValidators';

const router = Router();

router.post('/signup', validateBody(validateSignup), (req, res, next) => authController.signup(req, res, next));
router.post('/login', validateBody(validateLogin), (req, res, next) => authController.login(req, res, next));
router.post('/send-otp', validateBody(validateSendOtp), (req, res, next) => authController.sendOtp(req, res, next));
router.post('/verify-otp', validateBody(validateVerifyOtp), (req, res, next) => authController.verifyOtp(req, res, next));
router.post('/quick-demo', validateBody(validateQuickDemo), (req, res, next) => authController.quickDemo(req, res, next));
router.get('/me', authMiddleware, (req, res, next) => authController.getMe(req, res, next));

export default router;
