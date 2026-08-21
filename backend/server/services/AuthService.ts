import { userRepository, UserEntity } from '../repositories/UserRepository';
import { hashPassword, verifyPassword, generateToken } from '../utils/crypto';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../utils/errors';
import { UserProfile } from '../../../shared/types';

export class AuthService {
  public async signup(data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    role?: 'customer' | 'seller' | 'admin';
    sellerStoreName?: string;
    gstin?: string;
    city?: string;
  }): Promise<{ user: UserProfile; token: string }> {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('An account with this email already exists');
    }

    const existingPhone = await userRepository.findByPhone(data.phone);
    if (existingPhone) {
      throw new ConflictError('An account with this phone number already exists');
    }

    const passwordHash = hashPassword(data.password || 'buyzo@2026');
    const role = data.role || 'customer';
    const avatarLetter = (data.fullName.trim()[0] || 'U').toUpperCase();

    const newUser = await userRepository.create({
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      passwordHash,
      role,
      avatarLetter,
      isVip: true,
      sellerStoreName: role === 'seller' ? data.sellerStoreName || 'Apex Electronics & Fashion Hub' : undefined,
      gstin: role === 'seller' ? data.gstin || '27AADCB2230M1Z2' : undefined,
      city: data.city || 'Mumbai',
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    return { user: this.sanitizeUser(newUser), token };
  }

  public async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    return { user: this.sanitizeUser(user), token };
  }

  public async sendOtp(identifier: string, _method = 'phone'): Promise<{ message: string }> {
    // Instant OTP generation and simulated SMS dispatch
    return { message: `Instant OTP sent to ${identifier}` };
  }

  public async verifyOtp(data: {
    identifier: string;
    otp: string;
    role?: 'customer' | 'seller' | 'admin';
    fullName?: string;
    city?: string;
    sellerStoreName?: string;
    gstin?: string;
  }): Promise<{ user: UserProfile; token: string }> {
    let user = await userRepository.findByEmailOrPhone(data.identifier);

    if (!user) {
      // Auto-register if new OTP user
      const role = data.role || 'customer';
      const name =
        data.fullName ||
        (role === 'seller' ? 'Priya Patel' : role === 'admin' ? 'Vikram Singh' : 'Tejal Patil');

      user = await userRepository.create({
        id: `usr-${Date.now()}`,
        fullName: name,
        email: data.identifier.includes('@') ? data.identifier : `${data.identifier}@buyzo.in`,
        phone: data.identifier.replace(/\D/g, '') || '9820145678',
        passwordHash: hashPassword('buyzo@2026'),
        role,
        avatarLetter: name[0].toUpperCase(),
        isVip: true,
        sellerStoreName: role === 'seller' ? data.sellerStoreName || 'Apex Electronics & Fashion Hub' : undefined,
        gstin: role === 'seller' ? data.gstin || '27AADCB2230M1Z2' : undefined,
        city: data.city || 'Mumbai',
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    return { user: this.sanitizeUser(user), token };
  }

  public async quickDemoLogin(role: 'customer' | 'seller' | 'admin'): Promise<{ user: UserProfile; token: string }> {
    let targetEmail = 'tejal.patil@example.com';
    if (role === 'seller') targetEmail = 'priya.patel@apexretail.in';
    else if (role === 'admin') targetEmail = 'admin.vikram@buyzo.in';

    let user = await userRepository.findByEmail(targetEmail);
    if (!user) {
      const demoResult = await this.signup({
        fullName: role === 'seller' ? 'Priya Patel' : role === 'admin' ? 'Vikram Singh' : 'Tejal Patil',
        email: targetEmail,
        phone: role === 'seller' ? '9823456789' : role === 'admin' ? '9912345678' : '9820145678',
        role,
        sellerStoreName: role === 'seller' ? 'Apex Electronics & Fashion Hub' : undefined,
        gstin: role === 'seller' ? '27AADCB2230M1Z2' : undefined,
        city: role === 'admin' ? 'Bangalore' : 'Mumbai',
      });
      return demoResult;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    return { user: this.sanitizeUser(user), token };
  }

  public async getProfile(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserEntity): UserProfile {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarLetter: user.avatarLetter,
      isVip: user.isVip,
      sellerStoreName: user.sellerStoreName,
      gstin: user.gstin,
      city: user.city,
    };
  }
}

export const authService = new AuthService();
