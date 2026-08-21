import { db } from '../config/database';
import { Address } from '../../../shared/types';

export interface AddressEntity extends Address {
  userId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export class AddressRepository {
  public async findByUserId(userId: string): Promise<AddressEntity[]> {
    const addresses = db.getCollection<AddressEntity>('addresses');
    return addresses.filter((a) => a.userId === userId && !a.isDeleted);
  }

  public async findById(id: string): Promise<AddressEntity | null> {
    const addresses = db.getCollection<AddressEntity>('addresses');
    return addresses.find((a) => a.id === id && !a.isDeleted) || null;
  }

  public async create(userId: string, addressData: Omit<Address, 'id'>): Promise<AddressEntity> {
    const now = new Date().toISOString();
    const newAddress: AddressEntity = {
      ...addressData,
      id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };

    await db.updateCollection<AddressEntity>('addresses', (addresses) => {
      // If this is set to default or is the first address, reset other defaults
      if (newAddress.isDefault || !addresses.some((a) => a.userId === userId && !a.isDeleted)) {
        newAddress.isDefault = true;
        addresses.forEach((a) => {
          if (a.userId === userId) a.isDefault = false;
        });
      }
      addresses.push(newAddress);
    });

    return newAddress;
  }

  public async update(id: string, userId: string, updates: Partial<Address>): Promise<AddressEntity | null> {
    let updated: AddressEntity | null = null;

    await db.updateCollection<AddressEntity>('addresses', (addresses) => {
      const idx = addresses.findIndex((a) => a.id === id && a.userId === userId && !a.isDeleted);
      if (idx !== -1) {
        if (updates.isDefault) {
          addresses.forEach((a) => {
            if (a.userId === userId) a.isDefault = false;
          });
        }
        addresses[idx] = {
          ...addresses[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        updated = addresses[idx];
      }
    });

    return updated;
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    let deleted = false;

    await db.updateCollection<AddressEntity>('addresses', (addresses) => {
      const idx = addresses.findIndex((a) => a.id === id && a.userId === userId && !a.isDeleted);
      if (idx !== -1) {
        addresses[idx].isDeleted = true;
        addresses[idx].updatedAt = new Date().toISOString();
        deleted = true;

        // If default address was deleted, set next active address as default
        if (addresses[idx].isDefault) {
          const nextAddr = addresses.find((a) => a.userId === userId && !a.isDeleted);
          if (nextAddr) nextAddr.isDefault = true;
        }
      }
    });

    return deleted;
  }
}

export const addressRepository = new AddressRepository();
