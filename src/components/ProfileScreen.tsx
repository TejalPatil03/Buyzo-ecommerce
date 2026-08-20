import React from 'react';
import { Address, Product, UserRole, AppView, UserProfile } from '../types';

interface ProfileScreenProps {
  currentUser: UserProfile | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  addresses: Address[];
  wishlistProducts: Product[];
  onSelectProduct: (product: Product) => void;
  setCurrentView: (view: AppView) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  userRole,
  setUserRole,
  addresses,
  wishlistProducts,
  onSelectProduct,
  setCurrentView,
  onLogout,
}) => {
  return (
    <div id="profile-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-3xl mx-auto flex flex-col gap-4">
      {/* User Card */}
      {currentUser ? (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-['Public_Sans'] font-extrabold text-[22px] shadow-xs flex-shrink-0">
              {currentUser.avatarLetter || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-['Public_Sans'] font-bold text-[17px] text-[#0b1c30]">
                  {currentUser.fullName}
                </h2>
                <span className="bg-[#89f5e7]/60 text-[#007b71] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {currentUser.role === 'customer' ? 'BuyZo VIP Club' : `${currentUser.role} Account`}
                </span>
              </div>
              <p className="text-[12px] text-[#434655] mt-0.5">
                {currentUser.email} {currentUser.phone ? `| +91 ${currentUser.phone}` : ''}
              </p>
              <span className="text-[11px] text-[#737686]">Member since August 2023 • Verified Shopper</span>
            </div>
          </div>

          <button
            id="profile-logout-btn"
            onClick={onLogout}
            className="w-full sm:w-auto py-2 px-3.5 bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] font-bold text-[12px] rounded-xl border border-[#ffb4ab] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#004ac6] flex items-center justify-center font-bold text-[20px]">
              <span className="material-symbols-outlined text-[28px]">account_circle</span>
            </div>
            <div>
              <h2 className="font-['Public_Sans'] font-bold text-[16px] text-[#0b1c30]">
                Welcome to BuyZo
              </h2>
              <p className="text-[12px] text-[#737686]">
                Sign in to track orders, access VIP discounts, and sync your cart across devices.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('auth')}
            className="w-full sm:w-auto py-2.5 px-5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Login / Register
          </button>
        </div>
      )}

      {/* Role Switcher */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 shadow-xs flex flex-col gap-2">
        <h3 className="font-['Public_Sans'] font-bold text-[14px] text-[#0b1c30]">
          Active Account Mode
        </h3>
        <p className="text-[12px] text-[#434655]">
          Switch between shopper experience, seller merchant portal, and administrative governance:
        </p>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <button
            onClick={() => {
              setUserRole('customer');
              setCurrentView('home');
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-[12px] font-bold border transition-colors cursor-pointer ${
              userRole === 'customer'
                ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-xs'
                : 'bg-[#eff4ff] text-[#434655] border-[#c3c6d7] hover:bg-[#dce9ff]'
            }`}
          >
            Shopper
          </button>
          <button
            onClick={() => {
              setUserRole('seller');
              setCurrentView('seller-dashboard');
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-[12px] font-bold border transition-colors cursor-pointer ${
              userRole === 'seller'
                ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-xs'
                : 'bg-[#eff4ff] text-[#434655] border-[#c3c6d7] hover:bg-[#dce9ff]'
            }`}
          >
            Seller Portal
          </button>
          <button
            onClick={() => {
              setUserRole('admin');
              setCurrentView('admin-dashboard');
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-[12px] font-bold border transition-colors cursor-pointer ${
              userRole === 'admin'
                ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-xs'
                : 'bg-[#eff4ff] text-[#434655] border-[#c3c6d7] hover:bg-[#dce9ff]'
            }`}
          >
            Admin Console
          </button>
        </div>
      </div>

      {/* Wishlist Preview */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-['Public_Sans'] font-bold text-[14px] text-[#0b1c30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ba1a1a] fill text-[18px]">favorite</span>
            Saved Wishlist ({wishlistProducts.length})
          </h3>
        </div>

        {wishlistProducts.length === 0 ? (
          <p className="text-[12px] text-[#737686]">
            No items in your wishlist yet. Tap the heart icon on any product to save it here!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="border border-[#c3c6d7]/40 rounded-xl p-2 flex flex-col gap-1 cursor-pointer hover:border-[#004ac6] transition-all bg-[#f8f9ff]"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-square object-cover rounded-lg bg-white"
                />
                <span className="text-[12px] font-semibold text-[#0b1c30] line-clamp-1">{p.name}</span>
                <span className="text-[12px] font-bold text-[#004ac6]">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 shadow-xs flex flex-col gap-3">
        <h3 className="font-['Public_Sans'] font-bold text-[14px] text-[#0b1c30] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#004ac6] text-[18px]">location_on</span>
          Saved Delivery Addresses ({addresses.length})
        </h3>
        <div className="space-y-2">
          {addresses.map((a) => (
            <div key={a.id} className="p-3 rounded-xl bg-[#eff4ff]/60 border border-[#c3c6d7]/40 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0b1c30]">{a.fullName}</span>
                <span className="bg-[#dce9ff] text-[#004ac6] text-[10px] font-bold px-1.5 py-0.2 rounded">
                  {a.type}
                </span>
                {a.isDefault && <span className="text-[#007b71] font-bold">(Default)</span>}
              </div>
              <p className="text-[#434655] mt-0.5">
                {a.addressLine1}, {a.city}, {a.state} - {a.pincode}
              </p>
              <p className="text-[#737686]">Mobile: +91 {a.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Settings & Help */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 shadow-xs divide-y divide-[#c3c6d7]/30">
        <div className="py-2.5 flex justify-between items-center text-[13px]">
          <span className="text-[#0b1c30] font-medium">Language Preference</span>
          <span className="text-[#004ac6] font-bold">English (India)</span>
        </div>
        <div className="py-2.5 flex justify-between items-center text-[13px]">
          <span className="text-[#0b1c30] font-medium">Order SMS & WhatsApp Updates</span>
          <span className="text-[#007b71] font-bold">Enabled</span>
        </div>
        <div className="py-2.5 flex justify-between items-center text-[13px]">
          <span className="text-[#0b1c30] font-medium">BuyZo 24x7 Customer Helpdesk</span>
          <span className="text-[#004ac6] font-bold">1800-289-9600</span>
        </div>
      </div>
    </div>
  );
};
