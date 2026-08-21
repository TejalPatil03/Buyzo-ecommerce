import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { assistantService } from '../services/AssistantService';
import { sendSuccess } from '../utils/response';

export class AssistantController {
  public async chat(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { message, catalogContext } = req.body;
      const result = await assistantService.chat(message || '', catalogContext);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export const assistantController = new AssistantController();
