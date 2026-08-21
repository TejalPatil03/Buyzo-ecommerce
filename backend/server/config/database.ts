import fs from 'fs';
import path from 'path';
import { ENV } from './env';
import { logger } from './logger';
import { getInitialSeedData } from '../utils/seedData';

interface DatabaseSchema {
  users: any[];
  products: any[];
  categories: any[];
  addresses: any[];
  orders: any[];
  carts: any[];
  payments: any[];
  [key: string]: any[];
}

class TransactionalDatabase {
  private data: DatabaseSchema = {
    users: [],
    products: [],
    categories: [],
    addresses: [],
    orders: [],
    carts: [],
    payments: [],
  };
  private isInitialized = false;
  private writeLock: Promise<void> = Promise.resolve();
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || ENV.DB_PATH;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
        logger.info(`Loaded persistent database store from ${this.filePath}`, {
          usersCount: this.data.users?.length || 0,
          productsCount: this.data.products?.length || 0,
          ordersCount: this.data.orders?.length || 0,
        });
      } catch (err: any) {
        logger.warn(`Failed to read database store, re-initializing with seed data: ${err.message}`);
        this.data = getInitialSeedData();
        await this.flush();
      }
    } else {
      logger.info(`No existing database store found. Seeding initial data...`);
      this.data = getInitialSeedData();
      await this.flush();
    }

    this.isInitialized = true;
  }

  public getCollection<T = any>(name: keyof DatabaseSchema): T[] {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name] as T[];
  }

  public async updateCollection<T = any>(
    name: keyof DatabaseSchema,
    updater: (items: T[]) => T[] | void
  ): Promise<T[]> {
    const current = this.getCollection<T>(name);
    const updated = updater(current) || current;
    this.data[name] = updated;
    await this.flush();
    return this.data[name] as T[];
  }

  public async flush(): Promise<void> {
    // Acquire sequential write lock to guarantee atomic disk writes
    this.writeLock = this.writeLock.then(async () => {
      try {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const tempPath = `${this.filePath}.tmp.${Date.now()}`;
        const json = JSON.stringify(this.data, null, 2);
        await fs.promises.writeFile(tempPath, json, 'utf-8');
        await fs.promises.rename(tempPath, this.filePath);
      } catch (err: any) {
        logger.error(`Database flush error:`, err);
      }
    });

    await this.writeLock;
  }
}

export const db = new TransactionalDatabase();
