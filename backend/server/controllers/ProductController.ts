import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../middlewares/requestLogger';
import { productService } from '../services/ProductService';
import { sendSuccess } from '../utils/response';

export class ProductController {
  public async getProducts(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        query: req.query.q as string,
        category: req.query.category as string,
        brand: req.query.brand as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        inStockOnly: req.query.inStock === 'true',
        sellerId: req.query.sellerId as string,
        sort: req.query.sort as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
      };

      const result = await productService.getProducts(filters);
      return sendSuccess(res, result.products, undefined, 200, {
        total: result.total,
        page: filters.page,
        limit: filters.limit,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getProductById(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      return sendSuccess(res, { product });
    } catch (err) {
      next(err);
    }
  }

  public async getCategories(_req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories();
      return sendSuccess(res, categories);
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
