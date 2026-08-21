import { Request, Response } from 'express';

export class HealthController {
  public getHealth(_req: Request, res: Response) {
    return res.status(200).json({
      status: 'ok',
      app: 'BuyZo Marketplace API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  }
}

export const healthController = new HealthController();
