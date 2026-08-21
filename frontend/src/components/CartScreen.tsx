import React, { useState } from 'react';
import { CartItem, AppView } from '../types';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  setCurrentView: (view: AppView) => void;
  onProceedToCheckout: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  setCurrentView,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const originalTotal = cart.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const productDiscount = originalTotal - subtotal;
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const totalPayable = Math.max(0, subtotal - appliedDiscount + deliveryFee);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'BUYZO200') {
      if (subtotal >= 1000) {
        setAppliedDiscount(200);
        setCouponMessage({ type: 'success', text: 'Coupon BUYZO200 applied! ₹200 savings.' });
      } else {
        setCouponMessage({ type: 'error', text: 'BUYZO200 requires minimum cart of ₹1,000.' });
      }
    } else if (code === 'MAHABACHAT50') {
      setAppliedDiscount(50);
      setCouponMessage({ type: 'success', text: 'Coupon MAHABACHAT50 applied! ₹50 extra discount.' });
    } else if (code === 'FREEDEL') {
      setAppliedDiscount(deliveryFee);
      setCouponMessage({ type: 'success', text: 'Coupon FREEDEL applied! Free shipping unlocked.' });
    } else {
      setCouponMessage({ type: 'error', text: 'Invalid promo code. Try "BUYZO200" or "MAHABACHAT50".' });
    }
  };

  if (cart.length === 0) {
    return (
      <div id="cart-empty-screen" className="pt-24 pb-24 px-4 max-w-xl mx-auto text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-[#eff4ff] rounded-full flex items-center justify-center text-[#004ac6] mb-4 shadow-xs">
          <span className="material-symbols-outlined text-[40px]">shopping_cart</span>
        </div>
        <h2 className="font-['Public_Sans'] font-bold text-[22px] text-[#0b1c30] mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="font-['Public_Sans'] text-[14px] text-[#434655] mb-6">
          Explore today&apos;s Maha Bachat deals, electronics, groceries, and fashion.
        </p>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-[#004ac6] text-white px-8 py-3 rounded-full font-['Inter'] text-[14px] font-bold hover:bg-[#2563eb] transition-all shadow-md cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div id="cart-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-5xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Public_Sans'] font-extrabold text-[20px] sm:text-[22px] text-[#0b1c30]">
            Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
          </h1>
          <p className="text-[12px] text-[#737686]">All products backed by 7-Day Easy Returns</p>
        </div>
        <button
          onClick={() => setCurrentView('home')}
          className="text-[#004ac6] font-['Inter'] text-[13px] font-semibold hover:underline cursor-pointer"
        >
          + Add more items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Cart Items (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              id={`cart-item-${product.id}`}
              className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 flex gap-3.5 shadow-xs hover:border-[#004ac6]/40 transition-all"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#eff4ff] rounded-xl overflow-hidden flex-shrink-0 border border-[#c3c6d7]/30">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Public_Sans'] font-bold text-[14px] text-[#0b1c30] line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-['Public_Sans'] text-[11px] text-[#737686] mt-0.5">
                    Sold by <span className="font-medium text-[#0b1c30]">{product.seller.name}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-['Public_Sans'] font-bold text-[16px] text-[#0b1c30]">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="font-['Public_Sans'] text-[11px] text-[#737686] line-through">
                        ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-lg p-1 border border-[#c3c6d7]/50">
                      <button
                        onClick={() => {
                          if (quantity > 1) {
                            onUpdateQuantity(product.id, -1);
                          } else {
                            onRemoveItem(product.id);
                          }
                        }}
                        className="w-6 h-6 rounded bg-white text-[#0b1c30] flex items-center justify-center font-bold text-[14px] hover:bg-[#dce9ff] shadow-xs cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="font-['Inter'] font-bold text-[13px] text-[#0b1c30] px-1 min-w-[16px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="w-6 h-6 rounded bg-white text-[#0b1c30] flex items-center justify-center font-bold text-[14px] hover:bg-[#dce9ff] shadow-xs cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-[#ba1a1a] hover:text-[#93000a] p-1 cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Coupons & Bill Breakdown (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-20">
          {/* Coupons Section */}
          <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 shadow-xs">
            <label className="font-['Public_Sans'] font-bold text-[13px] text-[#0b1c30] mb-2 block flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">sell</span>
              Coupons & Bank Offers
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code (BUYZO200)"
                className="flex-1 bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] font-['Inter'] text-[#0b1c30] uppercase focus:bg-white focus:border-[#004ac6] outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-[#004ac6] text-white px-4 py-2 rounded-xl font-['Inter'] text-[13px] font-bold hover:bg-[#2563eb] cursor-pointer"
              >
                Apply
              </button>
            </div>

            {couponMessage && (
              <p
                className={`text-[12px] font-medium mt-2 ${
                  couponMessage.type === 'success' ? 'text-[#007b71]' : 'text-[#ba1a1a]'
                }`}
              >
                {couponMessage.text}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#c3c6d7]/30">
              <button
                onClick={() => {
                  setCouponCode('BUYZO200');
                }}
                className="bg-[#dce9ff] text-[#004ac6] text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer hover:bg-[#b4c5ff]"
              >
                BUYZO200 (₹200 off)
              </button>
              <button
                onClick={() => {
                  setCouponCode('MAHABACHAT50');
                }}
                className="bg-[#dce9ff] text-[#004ac6] text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer hover:bg-[#b4c5ff]"
              >
                MAHABACHAT50 (₹50 off)
              </button>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-5 shadow-xs flex flex-col gap-2.5">
            <h3 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30]">
              Price Summary
            </h3>
            <div className="flex justify-between text-[13px] text-[#434655]">
              <span>Total MRP</span>
              <span>₹{originalTotal.toLocaleString('en-IN')}</span>
            </div>
            {productDiscount > 0 && (
              <div className="flex justify-between text-[13px] text-[#007b71]">
                <span>Product Discounts</span>
                <span>- ₹{productDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-[13px] text-[#007b71]">
                <span>Coupon Savings</span>
                <span>- ₹{appliedDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[13px] text-[#434655]">
              <span>Delivery Charges</span>
              <span>{deliveryFee === 0 ? <strong className="text-[#007b71]">FREE</strong> : `₹${deliveryFee}`}</span>
            </div>

            <div className="h-[1px] bg-[#c3c6d7]/40 my-1" />

            <div className="flex justify-between text-[17px] font-extrabold text-[#0b1c30]">
              <span>Total Amount</span>
              <span>₹{totalPayable.toLocaleString('en-IN')}</span>
            </div>

            <button
              id="proceed-checkout-desktop-btn"
              onClick={onProceedToCheckout}
              className="w-full mt-3 bg-[#fd761a] hover:bg-[#ea580c] text-white font-['Inter'] font-bold text-[14px] py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Footer on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#c3c6d7] p-3.5 z-50 max-w-2xl mx-auto flex items-center justify-between shadow-[0px_-4px_12px_rgba(37,99,235,0.08)]">
        <div>
          <span className="text-[11px] text-[#737686] block">Total Amount</span>
          <span className="font-['Public_Sans'] font-bold text-[18px] text-[#0b1c30]">
            ₹{totalPayable.toLocaleString('en-IN')}
          </span>
        </div>
        <button
          id="proceed-checkout-mobile-btn"
          onClick={onProceedToCheckout}
          className="bg-[#fd761a] hover:bg-[#ea580c] text-white font-['Inter'] font-bold text-[14px] px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
