import { Router } from 'express';
import { assistantController } from '../../controllers/AssistantController';

const router = Router();

router.post('/chat', (req, res, next) => assistantController.chat(req, res, next));

export default router;
