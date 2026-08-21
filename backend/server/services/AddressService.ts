import { addressRepository } from '../repositories/AddressRepository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { Address } from '../../../shared/types';

export class AddressService {
  public async getAddresses(userId: string): Promise<Address[]> {
    return addressRepository.findByUserId(userId);
  }

  public async getAddressById(userId: string, addressId: string): Promise<Address> {
    const address = await addressRepository.findById(addressId);
    if (!address) {
      throw new NotFoundError(`Address '${addressId}' not found`);
    }
    if (address.userId !== userId) {
      throw new ForbiddenError('You can only access your own saved addresses');
    }
    return address;
  }

  public async addAddress(userId: string, addressData: Omit<Address, 'id'>): Promise<Address> {
    if (!addressData.fullName || !addressData.phone || !addressData.addressLine1 || !addressData.pincode) {
      throw new BadRequestError('Full name, phone, address line 1, and pincode are required');
    }
    return addressRepository.create(userId, addressData);
  }

  public async updateAddress(userId: string, addressId: string, updates: Partial<Address>): Promise<Address> {
    const existing = await addressRepository.findById(addressId);
    if (!existing) {
      throw new NotFoundError(`Address '${addressId}' not found`);
    }
    if (existing.userId !== userId) {
      throw new ForbiddenError('You can only update your own saved addresses');
    }

    const updated = await addressRepository.update(addressId, userId, updates);
    if (!updated) {
      throw new NotFoundError(`Address '${addressId}' not found`);
    }
    return updated;
  }

  public async deleteAddress(userId: string, addressId: string): Promise<void> {
    const existing = await addressRepository.findById(addressId);
    if (!existing) {
      throw new NotFoundError(`Address '${addressId}' not found`);
    }
    if (existing.userId !== userId) {
      throw new ForbiddenError('You can only delete your own saved addresses');
    }

    const success = await addressRepository.delete(addressId, userId);
    if (!success) {
      throw new NotFoundError(`Address '${addressId}' could not be deleted`);
    }
  }
}

export const addressService = new AddressService();
