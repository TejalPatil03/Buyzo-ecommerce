import { db } from '../config/database';
import { Product } from '../../../shared/types';

export interface ProductQueryFilters {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sellerId?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export class ProductRepository {
  public async findById(id: string): Promise<Product | null> {
    const products = db.getCollection<Product>('products');
    return products.find((p) => p.id === id && !(p as any).isDeleted) || null;
  }

  public async findMany(filters: ProductQueryFilters = {}): Promise<{ products: Product[]; total: number }> {
    let list = db.getCollection<Product>('products').filter((p) => !(p as any).isDeleted);

    // Text search query
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category && filters.category.trim() && filters.category !== 'All') {
      const cat = filters.category.trim().toLowerCase();
      list = list.filter((p) => p.category.toLowerCase() === cat);
    }

    // Brand filter
    if (filters.brand && filters.brand.trim()) {
      const b = filters.brand.trim().toLowerCase();
      list = list.filter((p) => p.brand?.toLowerCase() === b);
    }

    // Seller ID filter
    if (filters.sellerId) {
      list = list.filter((p) => p.seller?.id === filters.sellerId);
    }

    // Min Price
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }

    // Max Price
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // In Stock Only
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock && p.stockCount > 0);
    }

    // Sorting
    if (filters.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'newest') {
      list.sort((a, b) => ((b as any).createdAt || '').localeCompare((a as any).createdAt || ''));
    }

    const total = list.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(100, filters.limit || 50));
    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  public async findBySellerId(sellerId: string): Promise<Product[]> {
    const products = db.getCollection<Product>('products');
    return products.filter((p) => p.seller?.id === sellerId && !(p as any).isDeleted);
  }

  public async create(product: Product): Promise<Product> {
    const newProduct = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };

    await db.updateCollection<Product>('products', (products) => {
      products.unshift(newProduct);
    });

    return newProduct;
  }

  public async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    let updated: Product | null = null;

    await db.updateCollection<Product>('products', (products) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        } as Product;
        updated = products[idx];
      }
    });

    return updated;
  }

  public async updateStock(id: string, newStock: number): Promise<Product | null> {
    return this.update(id, {
      stockCount: newStock,
      inStock: newStock > 0,
    });
  }

  public async decrementStockAtomic(items: { productId: string; quantity: number }[]): Promise<boolean> {
    let success = false;

    await db.updateCollection<Product>('products', (products) => {
      // First verify all have sufficient stock
      for (const item of items) {
        const prod = products.find((p) => p.id === item.productId);
        if (!prod || prod.stockCount < item.quantity) {
          success = false;
          return; // Abort
        }
      }

      // Decrement all
      for (const item of items) {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockCount -= item.quantity;
          prod.inStock = prod.stockCount > 0;
          (prod as any).updatedAt = new Date().toISOString();
        }
      }
      success = true;
    });

    return success;
  }

  public async restoreStockAtomic(items: { productId: string; quantity: number }[]): Promise<void> {
    await db.updateCollection<Product>('products', (products) => {
      for (const item of items) {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockCount += item.quantity;
          prod.inStock = prod.stockCount > 0;
          (prod as any).updatedAt = new Date().toISOString();
        }
      }
    });
  }

  public async getAllCatalogSnapshot(): Promise<Product[]> {
    return db.getCollection<Product>('products').filter((p) => !(p as any).isDeleted);
  }
}

export const productRepository = new ProductRepository();
