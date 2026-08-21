import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Address, CartItem, Order, AppView } from '../types';

interface CheckoutScreenProps {
  cart: CartItem[];
  addresses: Address[];
  onAddAddress: (address: Address) => void;
  onPlaceOrderSuccess: (order: Order) => void;
  onProceedToPayment?: (address: Address, paymentMethod: string) => void;
  setCurrentView: (view: AppView) => void;
  onBack: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  addresses,
  onAddAddress,
  onPlaceOrderSuccess,
  onProceedToPayment,
  setCurrentView,
  onBack,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [selectedPayment, setSelectedPayment] = useState<string>('UPI');
  const [upiApp, setUpiApp] = useState<string>('Google Pay');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Address form fields
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const originalSubtotal = cart.reduce((sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity, 0);
  const totalSavings = Math.max(0, originalSubtotal - subtotal);
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const totalAmount = subtotal + deliveryFee;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newLine1 || !newPincode) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      fullName: newName,
      phone: newPhone,
      addressLine1: newLine1,
      city: newCity,
      state: newState,
      pincode: newPincode,
      isDefault: false,
      type: newType,
    };
    onAddAddress(newAddr);
    setSelectedAddressId(newAddr.id);
    setIsAddingAddress(false);
  };

  const handleDirectPlaceOrder = () => {
    const chosenAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    if (!chosenAddress) {
      alert('Please select or add a delivery address.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Trigger confetti celebration!
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
      });

      const formattedPaymentMethod = selectedPayment === 'UPI' ? `UPI (${upiApp})` : selectedPayment === 'COD' ? 'Cash on Delivery' : selectedPayment;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `BZ-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'Placed',
        items: [...cart],
        totalAmount: totalAmount,
        discountAmount: totalSavings,
        shippingFee: deliveryFee,
        deliveryAddress: chosenAddress,
        paymentMethod: formattedPaymentMethod,
        returnEligibleUntil: '30 Aug 2026',
        returnStatus: 'None',
        trackingEvents: [
          {
            title: 'Order Confirmed & Placed',
            description: selectedPayment === 'COD' ? 'Order booked for Cash on Delivery with SMS confirmation.' : `Payment authorized via ${formattedPaymentMethod}. Order verified.`,
            timestamp: 'Just now',
            location: 'BuyZo National Routing Hub',
            completed: true,
            current: true,
          },
          {
            title: 'Order Processing at Warehouse',
            description: 'Seller is preparing your items with safe packaging.',
            timestamp: 'Within 2 hours',
            location: 'Apex Seller Warehouse',
            completed: false,
            current: false,
          },
          {
            title: 'Handed to Express Courier',
            description: 'Package ready for fast air/surface transit.',
            timestamp: 'Tomorrow Morning',
            location: 'Express Logistics Hub',
            completed: false,
            current: false,
          },
          {
            title: 'Out for Delivery',
            description: 'Delivery executive assigned with doorstep OTP.',
            timestamp: 'Tomorrow 11:00 AM',
            location: chosenAddress.city,
            completed: false,
            current: false,
          },
          {
            title: 'Delivered',
            description: 'Package delivered safely to recipient.',
            timestamp: 'Tomorrow 02:00 PM',
            location: chosenAddress.addressLine1,
            completed: false,
            current: false,
          },
        ],
      };

      setIsProcessing(false);
      setConfirmedOrder(newOrder);
      onPlaceOrderSuccess(newOrder);
    }, 1200);
  };

  const handleProceedToPaymentStep = () => {
    const chosenAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    if (!chosenAddress) {
      alert('Please select or add a delivery address.');
      return;
    }

    if (selectedPayment === 'COD') {
      handleDirectPlaceOrder();
      return;
    }

    if (onProceedToPayment) {
      onProceedToPayment(chosenAddress, selectedPayment === 'UPI' ? `UPI (${upiApp})` : selectedPayment);
    } else {
      handleDirectPlaceOrder();
    }
  };

  // If order was just placed, display the Confirmed Receipt & Navigation view
  if (confirmedOrder) {
    return (
      <div id="order-confirmed-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-2xl mx-auto flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-6 sm:p-8 shadow-sm text-center">
          {/* Animated Success Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#89f5e7]/60 text-[#007b71] flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="material-symbols-outlined text-[36px] sm:text-[44px] font-bold">check_circle</span>
          </div>

          <span className="bg-[#89f5e7]/70 text-[#007b71] text-[11px] sm:text-[12px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed Successfully!
          </span>

          <h1 className="font-['Public_Sans'] font-black text-[22px] sm:text-[26px] text-[#0b1c30] mt-3">
            ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#434655] mt-1">
            Order <strong className="text-[#004ac6]">#{confirmedOrder.orderNumber}</strong> has been placed and added to your Orders section!
          </p>

          {/* Quick Summary Card */}
          <div className="bg-[#eff4ff] rounded-xl p-4 my-5 border border-[#b4c5ff]/60 text-left text-[12px] sm:text-[13px] space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[#737686]">Order ID:</span>
              <span className="font-mono font-bold text-[#0b1c30]">#{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#737686]">Payment Method:</span>
              <span className="font-bold text-[#004ac6]">{confirmedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#737686]">Delivery Recipient:</span>
              <span className="font-semibold text-[#0b1c30]">{confirmedOrder.deliveryAddress.fullName} ({confirmedOrder.deliveryAddress.city})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#737686]">Expected Delivery:</span>
              <span className="font-bold text-[#007b71]">Tomorrow by 02:00 PM</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#c3c6d7]/30">
              <span className="text-[#737686]">Items Ordered:</span>
              <span className="font-semibold text-[#0b1c30]">{confirmedOrder.items.length} item(s)</span>
            </div>
          </div>

          {/* Direct Navigation Buttons to Orders Section & Tracking */}
          <div className="flex flex-col gap-3">
            <button
              id="goto-orders-section-btn"
              onClick={() => setCurrentView('orders')}
              className="w-full py-3.5 px-4 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[14px] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              View in Orders Section
            </button>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id="track-confirmed-order-btn"
                onClick={() => setCurrentView('order-detail')}
                className="flex-1 py-3 px-4 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] font-bold text-[13px] rounded-xl transition-all border border-[#b4c5ff] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Track Live Shipment
              </button>

              <button
                onClick={() => setCurrentView('home')}
                className="flex-1 py-3 px-4 bg-white hover:bg-[#eff4ff] text-[#434655] font-bold text-[13px] rounded-xl transition-all border border-[#c3c6d7] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Checkout Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Public_Sans'] font-bold text-[18px] sm:text-[20px] text-[#0b1c30]">
            Complete Your Order
          </h1>
          <p className="text-[12px] text-[#737686]">Select address and confirm payment</p>
        </div>
        <span className="font-['Inter'] text-[11px] sm:text-[12px] font-semibold text-[#007b71] bg-[#89f5e7]/40 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          100% Safe & Secure
        </span>
      </div>

      {/* Step 1: Delivery Address */}
      <section className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 sm:p-5 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[15px] text-[#0b1c30] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#004ac6] text-white text-[11px] font-bold flex items-center justify-center">
              1
            </span>
            Delivery Address
          </h2>
          {!isAddingAddress && (
            <button
              onClick={() => setIsAddingAddress(true)}
              className="text-[#004ac6] font-['Inter'] font-bold text-[12px] hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add New Address
            </button>
          )}
        </div>

        {isAddingAddress ? (
          <form onSubmit={handleSaveNewAddress} className="flex flex-col gap-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full Name *"
                className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-[#004ac6]"
              />
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="10-digit Mobile Number *"
                className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-[#004ac6]"
              />
            </div>
            <input
              type="text"
              required
              value={newLine1}
              onChange={(e) => setNewLine1(e.target.value)}
              placeholder="Flat / House No. / Building / Street *"
              className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-[#004ac6]"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                required
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="City"
                className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
              />
              <input
                type="text"
                required
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="State"
                className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
              />
              <input
                type="text"
                required
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
                placeholder="Pincode *"
                className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
              />
            </div>
            <div className="flex gap-2 items-center">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(t)}
                  className={`px-3 py-1 text-[12px] rounded-xl font-semibold border cursor-pointer ${
                    newType === t
                      ? 'bg-[#004ac6] text-white border-[#004ac6]'
                      : 'bg-[#eff4ff] text-[#434655] border-[#c3c6d7]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="flex-1 py-2 border border-[#c3c6d7] rounded-xl text-[13px] font-semibold text-[#434655] cursor-pointer hover:bg-[#eff4ff]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#004ac6] text-white rounded-xl text-[13px] font-semibold hover:bg-[#2563eb] cursor-pointer"
              >
                Save & Use Address
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-2.5">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`p-3 sm:p-3.5 rounded-xl border flex gap-3 items-start cursor-pointer transition-all ${
                  selectedAddressId === addr.id
                    ? 'border-[#004ac6] bg-[#eff4ff]/60 ring-1 ring-[#004ac6]'
                    : 'border-[#c3c6d7]/50 hover:bg-[#f8f9ff]'
                }`}
              >
                <input
                  type="radio"
                  name="delivery_address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-1 text-[#004ac6] focus:ring-[#004ac6]"
                />
                <div className="flex-1 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="font-['Inter'] font-bold text-[#0b1c30]">{addr.fullName}</span>
                    <span className="bg-[#dce9ff] text-[#004ac6] text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] text-[#737686] font-medium">(Default)</span>
                    )}
                  </div>
                  <p className="text-[#434655] mt-0.5 leading-snug">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} -{' '}
                    <strong>{addr.pincode}</strong>
                  </p>
                  <p className="text-[#737686] text-[12px] mt-0.5">Mobile: {addr.phone}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* Step 2: Payment Method */}
      <section className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[15px] text-[#0b1c30] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#004ac6] text-white text-[11px] font-bold flex items-center justify-center">
              2
            </span>
            Select Payment Method
          </h2>
          <span className="text-[11px] font-bold text-[#007b71] bg-[#89f5e7]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] fill">shield</span>
            100% Encrypted
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* UPI */}
          <div
            onClick={() => setSelectedPayment('UPI')}
            className={`p-3 sm:p-3.5 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
              selectedPayment === 'UPI'
                ? 'border-[#004ac6] bg-[#eff4ff]/60 ring-1 ring-[#004ac6]'
                : 'border-[#c3c6d7]/50 hover:bg-[#f8f9ff]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="payment_method"
                  checked={selectedPayment === 'UPI'}
                  onChange={() => setSelectedPayment('UPI')}
                  className="text-[#004ac6] focus:ring-[#004ac6]"
                />
                <div>
                  <span className="font-['Inter'] font-bold text-[13px] text-[#0b1c30] block">
                    UPI (Google Pay, PhonePe, Paytm, QR)
                  </span>
                  <span className="text-[11px] text-[#737686]">Instant confirmation & zero gateway surcharge</span>
                </div>
              </div>
              <span className="text-[10px] text-[#007b71] font-bold bg-[#89f5e7]/50 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>

            {selectedPayment === 'UPI' && (
              <div className="flex gap-2 pl-6 pt-1 flex-wrap">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Scan QR'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUpiApp(app);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border cursor-pointer transition-all ${
                      upiApp === app
                        ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-xs'
                        : 'bg-white text-[#434655] border-[#c3c6d7] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cards */}
          <label
            onClick={() => setSelectedPayment('Card')}
            className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedPayment === 'Card'
                ? 'border-[#004ac6] bg-[#eff4ff]/60 ring-1 ring-[#004ac6]'
                : 'border-[#c3c6d7]/50 hover:bg-[#f8f9ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="payment_method"
                checked={selectedPayment === 'Card'}
                onChange={() => setSelectedPayment('Card')}
                className="text-[#004ac6] focus:ring-[#004ac6]"
              />
              <div>
                <span className="font-['Inter'] font-bold text-[13px] text-[#0b1c30] block">
                  Credit / Debit Card (Visa, Mastercard, RuPay)
                </span>
                <span className="text-[11px] text-[#737686]">Save card securely with 3D Secure 2.0 OTP</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[20px]">credit_card</span>
          </label>

          {/* Net Banking */}
          <label
            onClick={() => setSelectedPayment('NetBanking')}
            className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedPayment === 'NetBanking'
                ? 'border-[#004ac6] bg-[#eff4ff]/60 ring-1 ring-[#004ac6]'
                : 'border-[#c3c6d7]/50 hover:bg-[#f8f9ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="payment_method"
                checked={selectedPayment === 'NetBanking'}
                onChange={() => setSelectedPayment('NetBanking')}
                className="text-[#004ac6] focus:ring-[#004ac6]"
              />
              <div>
                <span className="font-['Inter'] font-bold text-[13px] text-[#0b1c30] block">
                  Net Banking
                </span>
                <span className="text-[11px] text-[#737686]">HDFC, SBI, ICICI, Axis, Kotak & 50+ Banks</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[20px]">account_balance</span>
          </label>

          {/* BuyZo PayLater */}
          <label
            onClick={() => setSelectedPayment('PayLater')}
            className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedPayment === 'PayLater'
                ? 'border-[#004ac6] bg-[#eff4ff]/60 ring-1 ring-[#004ac6]'
                : 'border-[#c3c6d7]/50 hover:bg-[#f8f9ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="payment_method"
                checked={selectedPayment === 'PayLater'}
                onChange={() => setSelectedPayment('PayLater')}
                className="text-[#004ac6] focus:ring-[#004ac6]"
              />
              <div>
                <span className="font-['Inter'] font-bold text-[13px] text-[#0b1c30] block">
                  BuyZo PayLater & 0% EMI
                </span>
                <span className="text-[11px] text-[#007b71] font-semibold">Pre-approved ₹25,000 credit line available</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#004ac6] bg-[#dce9ff] px-2 py-0.5 rounded-full">0% Interest</span>
          </label>

          {/* COD */}
          <label
            onClick={() => setSelectedPayment('COD')}
            className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedPayment === 'COD'
                ? 'border-[#004ac6] bg-[#eff4ff]/60 ring-1 ring-[#004ac6]'
                : 'border-[#c3c6d7]/50 hover:bg-[#f8f9ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="payment_method"
                checked={selectedPayment === 'COD'}
                onChange={() => setSelectedPayment('COD')}
                className="text-[#004ac6] focus:ring-[#004ac6]"
              />
              <div>
                <span className="font-['Inter'] font-bold text-[13px] text-[#0b1c30] block">
                  Cash on Delivery (Pay at Doorstep)
                </span>
                <span className="text-[11px] text-[#737686]">Pay with cash or scan courier QR at doorstep</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[20px]">payments</span>
          </label>
        </div>
      </section>

      {/* Step 3: Order Items Summary */}
      <section className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 sm:p-5 shadow-xs">
        <h2 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[15px] text-[#0b1c30] flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full bg-[#004ac6] text-white text-[11px] font-bold flex items-center justify-center">
            3
          </span>
          Items in this Order ({cart.length})
        </h2>
        <div className="divide-y divide-[#c3c6d7]/30">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="py-2.5 flex items-center justify-between text-[13px] gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 object-cover rounded-lg bg-[#eff4ff] border border-[#c3c6d7]/30 flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-semibold text-[#0b1c30] line-clamp-1">
                    {product.name}
                  </span>
                  <span className="text-[11px] text-[#737686] block">
                    Qty: {quantity} • ₹{product.price.toLocaleString('en-IN')} each
                  </span>
                </div>
              </div>
              <span className="font-bold text-[#0b1c30] flex-shrink-0">
                ₹{(product.price * quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        {/* Bill Breakdown */}
        <div className="mt-3 pt-3 border-t border-[#c3c6d7]/30 space-y-1.5 text-[12px]">
          <div className="flex justify-between text-[#434655]">
            <span>Items Subtotal:</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {totalSavings > 0 && (
            <div className="flex justify-between text-[#007b71] font-semibold">
              <span>Catalog Discount Saved:</span>
              <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-[#434655]">
            <span>Delivery Charges:</span>
            <span>{deliveryFee === 0 ? <strong className="text-[#007b71]">FREE</strong> : `₹${deliveryFee}`}</span>
          </div>
          <div className="flex justify-between text-[14px] font-bold text-[#0b1c30] pt-1 border-t border-[#c3c6d7]/20">
            <span>Total Payable Amount:</span>
            <span className="text-[#004ac6]">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </section>

      {/* Confirmation Actions on Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d7] p-3.5 z-50 max-w-2xl mx-auto flex items-center justify-between shadow-[0px_-4px_12px_rgba(37,99,235,0.08)]">
        <div>
          <span className="text-[11px] text-[#737686] block">Total to Pay</span>
          <span className="font-['Public_Sans'] font-black text-[18px] sm:text-[20px] text-[#0b1c30]">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedPayment !== 'COD' && (
            <button
              id="instant-confirm-order-btn"
              onClick={handleDirectPlaceOrder}
              disabled={isProcessing}
              className="bg-[#007b71] hover:bg-[#005f56] text-white font-['Inter'] font-bold text-[12px] sm:text-[13px] px-3.5 sm:px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1 disabled:opacity-50"
              title="1-Click Instant Order Confirmation"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              1-Click Confirm
            </button>
          )}

          <button
            id="confirm-place-order-btn"
            onClick={handleProceedToPaymentStep}
            disabled={isProcessing}
            className="bg-[#004ac6] hover:bg-[#2563eb] text-white font-['Inter'] font-bold text-[13px] sm:text-[14px] px-4 sm:px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                Confirming Order...
              </>
            ) : (
              <>
                <span>
                  {selectedPayment === 'COD'
                    ? 'Confirm Order (COD)'
                    : `Proceed to Pay (₹${totalAmount.toLocaleString('en-IN')})`}
                </span>
                <span className="material-symbols-outlined text-[18px]">
                  {selectedPayment === 'COD' ? 'check' : 'arrow_forward'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
