import { Router } from 'express';
import { productController } from '../../controllers/ProductController';

const router = Router();

router.get('/', (req, res, next) => productController.getProducts(req, res, next));
router.get('/categories', (req, res, next) => productController.getCategories(req, res, next));
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));

export default router;
