import { productRepository, ProductQueryFilters } from '../repositories/ProductRepository';
import { categoryRepository } from '../repositories/CategoryRepository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { Product, Category, UserProfile } from '../../../shared/types';

export class ProductService {
  public async getProducts(filters: ProductQueryFilters) {
    return productRepository.findMany(filters);
  }

  public async getProductById(id: string): Promise<Product> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }
    return product;
  }

  public async getCategories(): Promise<Category[]> {
    return categoryRepository.listAll();
  }

  public async createProduct(productData: Partial<Product>, sellerUser: UserProfile): Promise<Product> {
    if (!productData.name || !productData.price || !productData.category) {
      throw new BadRequestError('Product name, price, and category are required');
    }

    const price = Number(productData.price);
    const originalPrice = productData.originalPrice ? Number(productData.originalPrice) : price;
    const discountPercent =
      originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;
    const stockCount = productData.stockCount !== undefined ? Number(productData.stockCount) : 10;

    const newProduct: Product = {
      id: `prod-custom-${Date.now()}`,
      name: productData.name.trim(),
      brand: productData.brand || 'BuyZo Verified',
      category: productData.category as any,
      price,
      originalPrice,
      discountPercent,
      rating: 5.0,
      ratingCount: 1,
      image:
        productData.image ||
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
      additionalImages: productData.additionalImages || [],
      seller: {
        id: sellerUser.id,
        name: sellerUser.sellerStoreName || sellerUser.fullName,
        rating: 4.9,
        reviewsCount: 120,
        city: sellerUser.city || 'Mumbai',
        isVerified: true,
      },
      inStock: stockCount > 0,
      stockCount,
      deliveryTimeText: productData.deliveryTimeText || 'Free Delivery Tomorrow',
      description: productData.description || 'High quality certified genuine product on BuyZo.',
      specifications: productData.specifications || {
        Brand: productData.brand || 'BuyZo Verified',
        Category: productData.category,
      },
      reviews: [],
      tags: [productData.category.toLowerCase(), (productData.brand || '').toLowerCase()].filter(Boolean),
    };

    return productRepository.create(newProduct);
  }

  public async updateStock(productId: string, sellerId: string, newStock: number, isAdmin = false): Promise<Product> {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product '${productId}' not found`);
    }

    if (!isAdmin && product.seller?.id !== sellerId) {
      throw new ForbiddenError('You can only modify stock for your own listings');
    }

    const updated = await productRepository.updateStock(productId, newStock);
    if (!updated) {
      throw new NotFoundError(`Product '${productId}' not found`);
    }
    return updated;
  }
}

export const productService = new ProductService();
