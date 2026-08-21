import { db } from '../config/database';
import { Category } from '../../../shared/types';

export class CategoryRepository {
  public async listAll(): Promise<Category[]> {
    return db.getCollection<Category>('categories');
  }

  public async findById(id: string): Promise<Category | null> {
    const categories = db.getCollection<Category>('categories');
    return categories.find((c) => c.id === id) || null;
  }
}

export const categoryRepository = new CategoryRepository();
