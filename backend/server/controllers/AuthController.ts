import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { authService } from '../services/AuthService';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpCodes';

export class AuthController {
  public async signup(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      return sendSuccess(res, result, 'User registered successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  public async login(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  public async sendOtp(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { identifier, phone, email, method } = req.body;
      const result = await authService.sendOtp(identifier || phone || email, method);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async verifyOtp(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyOtp(req.body);
      return sendSuccess(res, result, 'OTP verified successfully');
    } catch (err) {
      next(err);
    }
  }

  public async quickDemo(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const result = await authService.quickDemoLogin(role);
      return sendSuccess(res, result, `Logged in as demo ${role}`);
    } catch (err) {
      next(err);
    }
  }

  public async getMe(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await authService.getProfile(req.user.id);
      return sendSuccess(res, { user: profile });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
