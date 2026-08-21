import { db } from '../config/database';

export interface UserEntity {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'customer' | 'seller' | 'admin';
  avatarLetter: string;
  isVip: boolean;
  sellerStoreName?: string;
  gstin?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export class UserRepository {
  public async findById(id: string): Promise<UserEntity | null> {
    const users = db.getCollection<UserEntity>('users');
    return users.find((u) => u.id === id && !u.isDeleted) || null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const users = db.getCollection<UserEntity>('users');
    const normalized = email.trim().toLowerCase();
    return users.find((u) => u.email.toLowerCase() === normalized && !u.isDeleted) || null;
  }

  public async findByPhone(phone: string): Promise<UserEntity | null> {
    const users = db.getCollection<UserEntity>('users');
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    return users.find((u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone && !u.isDeleted) || null;
  }

  public async findByEmailOrPhone(identifier: string): Promise<UserEntity | null> {
    if (identifier.includes('@')) {
      return this.findByEmail(identifier);
    }
    return this.findByPhone(identifier);
  }

  public async create(user: Omit<UserEntity, 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<UserEntity> {
    const now = new Date().toISOString();
    const newUser: UserEntity = {
      ...user,
      email: user.email.toLowerCase(),
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };

    await db.updateCollection<UserEntity>('users', (users) => {
      users.push(newUser);
    });

    return newUser;
  }

  public async update(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
    let updatedUser: UserEntity | null = null;

    await db.updateCollection<UserEntity>('users', (users) => {
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        updatedUser = users[idx];
      }
    });

    return updatedUser;
  }

  public async listAllSellers(): Promise<UserEntity[]> {
    const users = db.getCollection<UserEntity>('users');
    return users.filter((u) => u.role === 'seller' && !u.isDeleted);
  }
}

export const userRepository = new UserRepository();
