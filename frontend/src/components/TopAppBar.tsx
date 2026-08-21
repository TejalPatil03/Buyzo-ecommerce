import React, { useState } from 'react';
import { AppView, UserRole, UserProfile } from '../types';

interface TopAppBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onBack?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  userRole,
  setUserRole,
  currentUser,
  onLogout,
  onBack,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isSearchOrDetail =
    currentView === 'search' ||
    currentView === 'product-detail' ||
    currentView === 'checkout' ||
    currentView === 'order-detail' ||
    currentView === 'payment';

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/95 backdrop-blur-md border-b border-[#c3c6d7]/60 h-14 flex items-center justify-between px-3 sm:px-4 max-w-7xl mx-auto shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          {/* Back Button or Menu Toggle */}
          {isSearchOrDetail ? (
            <button
              id="top-nav-back-button"
              onClick={onBack || (() => setCurrentView('home'))}
              className="p-1.5 text-[#0b1c30] hover:bg-[#d3e4fe]/50 transition-colors rounded-full active:opacity-80 flex items-center justify-center cursor-pointer flex-shrink-0"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <button
              id="top-nav-menu-button"
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 text-[#434655] hover:bg-[#d3e4fe]/50 transition-colors rounded-full active:opacity-80 flex items-center justify-center cursor-pointer flex-shrink-0"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}

          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className={`font-['Public_Sans'] font-extrabold text-[20px] sm:text-[22px] text-[#004ac6] tracking-tight cursor-pointer select-none flex items-center gap-1 flex-shrink-0 ${
              currentView === 'search' ? 'hidden sm:flex' : 'flex'
            }`}
          >
            BuyZo
            {userRole !== 'customer' && (
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#2563eb] text-white ml-0.5 sm:ml-1">
                {userRole}
              </span>
            )}
          </div>

          {/* Global Search Input */}
          <div className="flex-1 max-w-xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit(searchQuery);
              }}
              className="relative w-full"
            >
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[18px] sm:text-[20px] pointer-events-none">
                search
              </span>
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (currentView !== 'search') {
                    setCurrentView('search');
                  }
                }}
                placeholder="Search products, brands, groceries..."
                className="w-full bg-[#eff4ff] border border-[#c3c6d7]/70 rounded-full py-1.5 pl-9 sm:pl-10 pr-8 font-['Public_Sans'] text-[12px] sm:text-[13px] text-[#0b1c30] placeholder-[#737686] focus:bg-white focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  id="clear-search-button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#737686] hover:text-[#0b1c30] rounded-full"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </form>
          </div>

          {/* Role Switcher (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-[#eff4ff] p-1 rounded-lg border border-[#c3c6d7]/50 text-[11px] font-semibold flex-shrink-0">
            <button
              onClick={() => {
                setUserRole('customer');
                setCurrentView('home');
              }}
              className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                userRole === 'customer'
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              Shopper
            </button>
            <button
              onClick={() => {
                setUserRole('seller');
                setCurrentView('seller-dashboard');
              }}
              className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                userRole === 'seller'
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              Seller
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setCurrentView('admin-dashboard');
              }}
              className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                userRole === 'admin'
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              Admin
            </button>
          </div>

          {/* AI Assistant Quick Pill (Tablet/Desktop) */}
          <button
            id="top-ai-assistant-btn"
            onClick={() => handleNavClick('assistant')}
            className="hidden md:flex items-center gap-1.5 bg-[#dce9ff] text-[#004ac6] px-3 py-1.5 rounded-full text-[12px] font-bold hover:bg-[#b4c5ff] transition-colors cursor-pointer border border-[#b4c5ff] flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] text-[#004ac6]">auto_awesome</span>
            AI Assistant
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative flex-shrink-0">
              <button
                id="top-profile-menu-btn"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#eff4ff] border border-transparent hover:border-[#c3c6d7] transition-all cursor-pointer"
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-[13px] shadow-xs">
                  {currentUser.avatarLetter || 'U'}
                </div>
                <span className="hidden sm:inline text-[12px] font-bold text-[#0b1c30] max-w-[80px] truncate">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#737686] hidden sm:inline">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#c3c6d7] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#c3c6d7]/30">
                    <span className="font-bold text-[13px] text-[#0b1c30] block truncate">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[11px] text-[#737686] block truncate">
                      {currentUser.email}
                    </span>
                    <span className="inline-block mt-1 bg-[#89f5e7]/60 text-[#007b71] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {currentUser.role === 'customer' ? 'VIP Member' : `${currentUser.role} portal`}
                    </span>
                  </div>

                  <div className="py-1 text-[12px]">
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full px-4 py-2 text-left text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#004ac6]">person</span>
                      My Account & Addresses
                    </button>
                    <button
                      onClick={() => handleNavClick('orders')}
                      className="w-full px-4 py-2 text-left text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#004ac6]">receipt_long</span>
                      My Orders & Returns
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('seller');
                        handleNavClick('seller-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#004ac6]">storefront</span>
                      Seller Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('admin');
                        handleNavClick('admin-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#004ac6]">admin_panel_settings</span>
                      Admin Governance
                    </button>
                  </div>

                  <div className="border-t border-[#c3c6d7]/30 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2 cursor-pointer font-bold text-[12px]"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="top-signin-btn"
              onClick={() => handleNavClick('auth')}
              className="flex items-center gap-1 bg-[#004ac6] text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-[12px] font-bold hover:bg-[#2563eb] transition-all shadow-xs cursor-pointer flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span className="hidden xs:inline">Sign In</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            id="top-nav-cart-button"
            onClick={() => handleNavClick('cart')}
            className="p-1.5 sm:p-2 text-[#004ac6] hover:bg-[#d3e4fe]/50 transition-colors rounded-full active:opacity-80 relative flex-shrink-0 cursor-pointer"
            aria-label="View shopping cart"
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">shopping_cart</span>
            {cartCount > 0 && (
              <span
                id="cart-badge-count"
                className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] bg-[#fd761a] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#f8f9ff] shadow-xs"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex animate-in fade-in duration-150">
          <div className="bg-white w-[280px] h-full shadow-2xl flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#c3c6d7]/40 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-['Public_Sans'] font-extrabold text-[22px] text-[#004ac6]">
                    BuyZo
                  </span>
                  <span className="bg-[#89f5e7]/60 text-[#007b71] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    India&apos;s Store
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 text-[#737686] hover:text-[#0b1c30] rounded-full"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              {/* User Greeting / Auth Status */}
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c3c6d7]/40 mb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-[16px]">
                  {currentUser ? currentUser.avatarLetter : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[13px] text-[#0b1c30] block truncate">
                    {currentUser ? currentUser.fullName : 'Guest Shopper'}
                  </span>
                  {currentUser ? (
                    <span className="text-[11px] text-[#007b71] font-semibold">VIP Member</span>
                  ) : (
                    <button
                      onClick={() => handleNavClick('auth')}
                      className="text-[11px] text-[#004ac6] font-bold hover:underline"
                    >
                      Login / Sign Up →
                    </button>
                  )}
                </div>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1 text-[13px] font-medium text-[#0b1c30]">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    currentView === 'home' ? 'bg-[#dce9ff] text-[#004ac6] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-[#004ac6]">home</span>
                  Home Marketplace
                </button>
                <button
                  onClick={() => handleNavClick('search')}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    currentView === 'search' ? 'bg-[#dce9ff] text-[#004ac6] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-[#004ac6]">category</span>
                  Explore Categories & Deals
                </button>
                <button
                  onClick={() => handleNavClick('assistant')}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    currentView === 'assistant' ? 'bg-[#dce9ff] text-[#004ac6] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-[#004ac6]">auto_awesome</span>
                  AI Shopping Assistant
                </button>
                <button
                  onClick={() => handleNavClick('orders')}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    currentView === 'orders' ? 'bg-[#dce9ff] text-[#004ac6] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-[#004ac6]">receipt_long</span>
                  My Orders & Live Tracking
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    currentView === 'profile' ? 'bg-[#dce9ff] text-[#004ac6] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-[#004ac6]">person</span>
                  Profile & Addresses
                </button>
                <button
                  onClick={() => {
                    setUserRole('seller');
                    handleNavClick('seller-dashboard');
                  }}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    currentView === 'seller-dashboard' ? 'bg-[#dce9ff] text-[#004ac6] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-[#004ac6]">storefront</span>
                  Seller Portal
                </button>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    handleNavClick('admin-dashboard');
                  }}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    currentView === 'admin-dashboard' ? 'bg-[#dce9ff] text-[#004ac6] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-[#004ac6]">admin_panel_settings</span>
                  Admin Governance
                </button>
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-[#c3c6d7]/40 pt-3">
              {currentUser ? (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 bg-[#ffdad6] text-[#ba1a1a] font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full py-2.5 px-3 bg-[#004ac6] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};
