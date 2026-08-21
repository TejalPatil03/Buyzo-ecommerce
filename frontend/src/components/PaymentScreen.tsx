import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Address, CartItem, Order, PaymentTransaction, AppView } from '../types';

interface PaymentScreenProps {
  cart: CartItem[];
  deliveryAddress?: Address;
  totalAmount?: number;
  deliveryFee?: number;
  initialMethod?: string;
  onPaymentSuccess?: (order: Order) => void;
  onPaymentComplete?: (transaction: PaymentTransaction, order: Order) => void;
  onCancel?: () => void;
  onBack?: () => void;
  setCurrentView?: (view: AppView) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  cart,
  deliveryAddress,
  totalAmount: propTotalAmount,
  deliveryFee: propDeliveryFee,
  initialMethod,
  onPaymentSuccess,
  onPaymentComplete,
  onCancel,
  onBack,
  setCurrentView,
}) => {
  // Determine initial payment tab from method string
  const getInitialTab = (): 'upi' | 'card' | 'netbanking' | 'paylater' | 'cod' => {
    if (!initialMethod) return 'upi';
    const lower = initialMethod.toLowerCase();
    if (lower.includes('card')) return 'card';
    if (lower.includes('netbanking') || lower.includes('net banking')) return 'netbanking';
    if (lower.includes('paylater') || lower.includes('emi')) return 'paylater';
    if (lower.includes('cod') || lower.includes('cash')) return 'cod';
    return 'upi';
  };

  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking' | 'paylater' | 'cod'>(getInitialTab);
  
  // Safe calculation of amounts
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = propDeliveryFee !== undefined ? propDeliveryFee : (subtotal > 500 ? 0 : 49);
  const totalAmount = propTotalAmount !== undefined ? propTotalAmount : (subtotal + deliveryFee);

  const fallbackAddress: Address = deliveryAddress || {
    id: 'default-addr',
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    addressLine1: 'B-402, Green Meadows',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    isDefault: true,
    type: 'Home',
  };
  const activeAddress = deliveryAddress || fallbackAddress;

  const handleGoBack = () => {
    if (onBack) onBack();
    else if (onCancel) onCancel();
    else if (setCurrentView) setCurrentView('checkout');
  };
  
  // UPI State
  const [upiMode, setUpiMode] = useState<'apps' | 'qr' | 'vpa'>('apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [vpaId, setVpaId] = useState('rahul.sharma@okhdfcbank');
  const [isVpaVerified, setIsVpaVerified] = useState(true);

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8920 4410 9982');
  const [cardHolder, setCardHolder] = useState('RAHUL SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('458');
  const [saveCard, setSaveCard] = useState(true);
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'rupay'>('visa');

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // COD Captcha State
  const [captchaCode, setCaptchaCode] = useState('8492');
  const [userCaptcha, setUserCaptcha] = useState('');

  // Processing & Verification Modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [bankOtp, setBankOtp] = useState(['5', '4', '8', '9']);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Gateway Session Countdown Timer (15 min)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Card formatting & brand detection
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    if (val.startsWith('4')) setCardType('visa');
    else if (val.startsWith('5')) setCardType('mastercard');
    else setCardType('rupay');
    
    // Add spaces every 4 digits
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setCardExpiry(val);
  };

  const generateCompletedOrder = (txDetails: PaymentTransaction): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `BZ-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Placed',
      items: [...cart],
      totalAmount: totalAmount,
      discountAmount: 0,
      shippingFee: deliveryFee,
      deliveryAddress: activeAddress,
      paymentMethod: txDetails.subMethod ? `${txDetails.method} (${txDetails.subMethod})` : txDetails.method,
      paymentDetails: txDetails,
      returnEligibleUntil: '30 Aug 2026',
      returnStatus: 'None',
      trackingEvents: [
        {
          title: 'Payment Authorized & Order Confirmed',
          description: `Txn Ref: ${txDetails.transactionRef}. Payment verified via secure gateway.`,
          timestamp: 'Just now',
          location: 'BuyZo National Routing Hub',
          completed: true,
          current: true,
        },
        {
          title: 'Assigned to Fulfillment Merchant',
          description: 'Merchant notified to pick and pack items.',
          timestamp: 'Within 2 hours',
          location: 'Merchant Warehouse',
          completed: false,
          current: false,
        },
        {
          title: 'Handed over to Express Courier',
          description: 'Package ready for fast ground/air dispatch.',
          timestamp: 'Tomorrow Morning',
          location: 'Logistics Sort Center',
          completed: false,
          current: false,
        },
        {
          title: 'Out for Delivery',
          description: 'Delivery executive will verify OTP at doorstep.',
          timestamp: 'Tomorrow 02:00 PM',
          location: activeAddress.city,
          completed: false,
          current: false,
        },
        {
          title: 'Delivered',
          description: 'Package delivered safely.',
          timestamp: 'Tomorrow 04:00 PM',
          location: activeAddress.addressLine1,
          completed: false,
          current: false,
        },
      ],
    };
    return newOrder;
  };

  const finalizePayment = (methodName: PaymentTransaction['method'], subMethodName?: string) => {
    const tx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      orderId: `ord-${Date.now()}`,
      amount: totalAmount,
      method: methodName,
      subMethod: subMethodName,
      status: 'Success',
      transactionRef: `TXN-BZ-${Math.floor(10000000 + Math.random() * 90000000)}`,
      bankRef: `RRN-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      upiVpa: methodName === 'UPI' ? vpaId : undefined,
      cardLast4: methodName === 'Card' ? cardNumber.replace(/\s/g, '').slice(-4) : undefined,
      bankName: methodName === 'NetBanking' ? selectedBank : undefined,
      timestamp: new Date().toLocaleTimeString('en-IN'),
    };

    const order = generateCompletedOrder(tx);
    setCompletedOrder(order);
    setIsProcessing(false);
    setShowOtpModal(false);

    // Fire Confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    if (onPaymentComplete) {
      onPaymentComplete(tx, order);
    }
    if (onPaymentSuccess) {
      onPaymentSuccess(order);
    }
  };

  const handleStartPayment = () => {
    setIsProcessing(true);

    if (paymentTab === 'card') {
      setProcessingMessage('Connecting to Bank 3D-Secure 2.0...');
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtpModal(true);
      }, 1000);
    } else if (paymentTab === 'upi') {
      if (upiMode === 'apps') {
        setProcessingMessage(`Opening ${selectedUpiApp}... Approve prompt on your screen.`);
      } else if (upiMode === 'qr') {
        setProcessingMessage('Waiting for QR Code scan and biometric PIN verification...');
      } else {
        setProcessingMessage(`Sending UPI collection collect request to ${vpaId}...`);
      }
      setTimeout(() => {
        finalizePayment('UPI', selectedUpiApp || 'UPI QR');
      }, 2000);
    } else if (paymentTab === 'netbanking') {
      setProcessingMessage(`Redirecting to ${selectedBank} Corporate NetBanking Portal...`);
      setTimeout(() => {
        finalizePayment('NetBanking', selectedBank);
      }, 1800);
    } else if (paymentTab === 'paylater') {
      setProcessingMessage('Verifying BuyZo Pre-Approved ₹25,000 Credit Line...');
      setTimeout(() => {
        finalizePayment('PayLater', 'BuyZo 0% EMI');
      }, 1400);
    } else if (paymentTab === 'cod') {
      if (userCaptcha !== captchaCode) {
        setIsProcessing(false);
        alert('Please enter correct captcha code to confirm COD.');
        return;
      }
      setProcessingMessage('Confirming Cash On Delivery Booking with Anti-Fraud check...');
      setTimeout(() => {
        finalizePayment('COD', 'Cash On Delivery');
      }, 1200);
    }
  };

  // If order was successfully completed, show verified receipt
  if (completedOrder) {
    return (
      <div id="payment-receipt-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-2xl mx-auto flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-6 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-[#89f5e7]/50 text-[#007b71] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[36px] font-bold">check_circle</span>
          </div>

          <span className="bg-[#89f5e7]/60 text-[#007b71] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Payment Verified & Successful
          </span>

          <h1 className="font-['Public_Sans'] font-black text-[22px] text-[#0b1c30] mt-2">
            ₹{completedOrder.totalAmount.toLocaleString('en-IN')}
          </h1>
          <p className="text-[13px] text-[#434655]">
            Order #{completedOrder.orderNumber} is confirmed!
          </p>

          {/* Receipt Breakdown Card */}
          <div className="bg-[#eff4ff]/70 rounded-xl p-4 my-5 border border-[#c3c6d7]/40 text-left text-[12px] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#737686]">Transaction Reference</span>
              <span className="font-mono font-bold text-[#0b1c30]">{completedOrder.paymentDetails?.transactionRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737686]">Bank Reference / RRN</span>
              <span className="font-mono font-bold text-[#0b1c30]">{completedOrder.paymentDetails?.bankRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737686]">Payment Method</span>
              <span className="font-bold text-[#004ac6]">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737686]">Delivery Address</span>
              <span className="font-bold text-[#0b1c30] text-right max-w-[200px] line-clamp-1">{completedOrder.deliveryAddress.fullName}, {completedOrder.deliveryAddress.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737686]">Estimated Delivery</span>
              <span className="font-bold text-[#007b71]">Tomorrow by 04:00 PM</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              id="view-in-orders-section-btn"
              onClick={() => {
                if (setCurrentView) setCurrentView('orders');
              }}
              className="w-full py-3.5 px-4 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[14px] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              View in Orders Section
            </button>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id="view-order-tracking-btn"
                onClick={() => {
                  if (setCurrentView) setCurrentView('order-detail');
                }}
                className="flex-1 py-3 px-4 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] font-bold text-[13px] rounded-xl transition-all border border-[#b4c5ff] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Track Order Live
              </button>
              <button
                onClick={() => {
                  if (setCurrentView) setCurrentView('home');
                }}
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
    <div id="payment-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Bank Grade Header */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#004ac6] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">lock</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Public_Sans'] font-bold text-[16px] text-[#0b1c30]">
                BuyZo Secure Payment
              </h1>
              <span className="bg-[#89f5e7]/60 text-[#007b71] text-[10px] font-bold px-2 py-0.5 rounded-full">
                256-Bit SSL
              </span>
            </div>
            <p className="text-[12px] text-[#434655]">
              Session expires in: <span className="font-mono font-bold text-[#ba1a1a]">{formatTimer(timeLeft)}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-[#737686] block">Amount to Pay</span>
          <span className="font-['Public_Sans'] font-black text-[20px] text-[#004ac6]">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left Side Navigation Pills */}
        <div className="w-full md:w-56 bg-[#eff4ff]/60 border-b md:border-b-0 md:border-r border-[#c3c6d7]/50 p-2 flex md:flex-col gap-1.5 overflow-x-auto">
          {[
            { id: 'upi', label: 'UPI (GPay / PhonePe)', icon: 'qr_code_2', badge: 'Instant' },
            { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card', badge: 'All Banks' },
            { id: 'netbanking', label: 'Net Banking', icon: 'account_balance' },
            { id: 'paylater', label: 'BuyZo PayLater', icon: 'bolt', badge: '0% EMI' },
            { id: 'cod', label: 'Cash On Delivery', icon: 'payments' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPaymentTab(tab.id as any)}
              className={`p-2.5 rounded-xl text-left text-[12px] font-bold flex items-center justify-between transition-all cursor-pointer whitespace-nowrap md:whitespace-normal ${
                paymentTab === tab.id
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'text-[#434655] hover:bg-[#dce9ff]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 hidden sm:inline ${
                    paymentTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#dce9ff] text-[#004ac6]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Side Method Details */}
        <div className="flex-1 p-4 sm:p-5">
          {/* TAB 1: UPI */}
          {paymentTab === 'upi' && (
            <div className="flex flex-col gap-4">
              <div className="flex bg-[#eff4ff] p-1 rounded-xl border border-[#c3c6d7]/40">
                <button
                  type="button"
                  onClick={() => setUpiMode('apps')}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    upiMode === 'apps' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
                  }`}
                >
                  UPI Apps
                </button>
                <button
                  type="button"
                  onClick={() => setUpiMode('qr')}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    upiMode === 'qr' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
                  }`}
                >
                  Scan QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setUpiMode('vpa')}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    upiMode === 'vpa' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
                  }`}
                >
                  UPI ID (VPA)
                </button>
              </div>

              {upiMode === 'apps' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { name: 'Google Pay', icon: 'g_mobiledata', color: 'text-[#4285F4]' },
                    { name: 'PhonePe', icon: 'call_to_action', color: 'text-[#6739B7]' },
                    { name: 'Paytm', icon: 'account_balance_wallet', color: 'text-[#00BAF2]' },
                    { name: 'BHIM UPI', icon: 'qr_code_scanner', color: 'text-[#007b71]' },
                    { name: 'CRED UPI', icon: 'credit_score', color: 'text-[#0b1c30]' },
                    { name: 'Amazon Pay', icon: 'shopping_bag', color: 'text-[#FF9900]' },
                  ].map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.name)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                        selectedUpiApp === app.name
                          ? 'border-[#004ac6] bg-[#eff4ff] ring-1 ring-[#004ac6]'
                          : 'border-[#c3c6d7]/50 hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[24px] ${app.color}`}>
                        {app.icon}
                      </span>
                      <div>
                        <span className="font-bold text-[13px] text-[#0b1c30] block">{app.name}</span>
                        <span className="text-[10px] text-[#737686]">Instant Approval</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {upiMode === 'qr' && (
                <div className="flex flex-col items-center justify-center p-4 bg-[#eff4ff]/60 rounded-xl border border-[#c3c6d7]/40 text-center">
                  <div className="relative p-3 bg-white rounded-xl shadow-xs border border-[#c3c6d7]/60 mb-2">
                    {/* Simulated Dynamic UPI QR SVG */}
                    <div className="w-36 h-36 bg-[#0b1c30] p-1.5 rounded-lg flex items-center justify-center">
                      <div className="w-full h-full bg-white p-2 rounded flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-8 h-8 border-4 border-[#004ac6] bg-[#004ac6]/20"></div>
                          <div className="w-8 h-8 border-4 border-[#004ac6] bg-[#004ac6]/20"></div>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-[10px] font-black text-[#004ac6]">BUYZO UPI</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="w-8 h-8 border-4 border-[#004ac6] bg-[#004ac6]/20"></div>
                          <div className="w-6 h-6 bg-[#007b71] rounded-full flex items-center justify-center text-white text-[8px] font-bold">₹</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[#0b1c30]">
                    Scan using any UPI App (GPay, PhonePe, Paytm, BHIM)
                  </span>
                  <span className="text-[11px] text-[#737686] mt-0.5">
                    Live dynamic QR linked to ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {upiMode === 'vpa' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                      Enter UPI ID / VPA
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={vpaId}
                        onChange={(e) => setVpaId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="flex-1 bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2 text-[13px] text-[#0b1c30] outline-none focus:bg-white focus:border-[#004ac6]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsVpaVerified(true)}
                        className="px-3.5 py-2 bg-[#dce9ff] text-[#004ac6] text-[12px] font-bold rounded-xl border border-[#b4c5ff]"
                      >
                        {isVpaVerified ? 'Verified ✓' : 'Verify'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['@okhdfcbank', '@okaxis', '@ybl', '@paytm', '@ibl'].map((ext) => (
                      <button
                        key={ext}
                        type="button"
                        onClick={() => setVpaId((prev) => (prev.includes('@') ? prev.split('@')[0] + ext : prev + ext))}
                        className="px-2 py-1 bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff] text-[11px] font-semibold rounded border border-[#c3c6d7]"
                      >
                        {ext}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREDIT / DEBIT CARD */}
          {paymentTab === 'card' && (
            <div className="flex flex-col gap-4">
              {/* 3D Virtual Card Preview */}
              <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-[#00348c] via-[#004ac6] to-[#2563eb] text-white p-4 shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex justify-between items-center">
                  <span className="font-['Public_Sans'] font-black text-[15px] tracking-wider">BuyZo Platinum</span>
                  <span className="text-[12px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">
                    {cardType.toUpperCase()}
                  </span>
                </div>
                <div className="font-mono text-[16px] sm:text-[18px] tracking-[0.2em] font-semibold">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between items-end text-[11px]">
                  <div>
                    <span className="text-white/70 text-[9px] uppercase block">Cardholder Name</span>
                    <span className="font-bold tracking-wide uppercase">{cardHolder || 'CARD HOLDER'}</span>
                  </div>
                  <div>
                    <span className="text-white/70 text-[9px] uppercase block">Expires</span>
                    <span className="font-mono font-bold">{cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 8920 4410 9982"
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2 text-[13px] text-[#0b1c30] font-mono focus:bg-white focus:border-[#004ac6] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                      Valid Thru (MM/YY)
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="08/29"
                      className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2 text-[13px] text-[#0b1c30] font-mono focus:bg-white focus:border-[#004ac6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                      CVV / Security Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="458"
                      className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2 text-[13px] text-[#0b1c30] font-mono focus:bg-white focus:border-[#004ac6] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="RAHUL SHARMA"
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2 text-[13px] text-[#0b1c30] focus:bg-white focus:border-[#004ac6] outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 text-[12px] text-[#434655] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="text-[#004ac6] rounded focus:ring-[#004ac6]"
                  />
                  Securely save this card for faster future checkouts
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {paymentTab === 'netbanking' && (
            <div className="flex flex-col gap-3">
              <label className="block text-[12px] font-semibold text-[#0b1c30]">
                Select Your Bank
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'HDFC Bank',
                  'State Bank of India',
                  'ICICI Bank',
                  'Axis Bank',
                  'Kotak Mahindra',
                  'Punjab National Bank',
                ].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    className={`p-2.5 rounded-xl border text-[12px] font-bold text-center transition-all cursor-pointer ${
                      selectedBank === b
                        ? 'border-[#004ac6] bg-[#eff4ff] text-[#004ac6] ring-1 ring-[#004ac6]'
                        : 'border-[#c3c6d7]/60 text-[#434655] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAY LATER */}
          {paymentTab === 'paylater' && (
            <div className="bg-[#eff4ff]/60 border border-[#c3c6d7]/50 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[14px] text-[#0b1c30] block">BuyZo PayLater & 0% EMI</span>
                  <span className="text-[12px] text-[#007b71] font-semibold">Pre-approved credit line: ₹25,000</span>
                </div>
                <span className="material-symbols-outlined text-[#004ac6] text-[32px]">verified</span>
              </div>
              <p className="text-[12px] text-[#434655]">
                Pay next month or convert to 3 easy installments with 0% interest and zero processing fee.
              </p>
            </div>
          )}

          {/* TAB 5: CASH ON DELIVERY */}
          {paymentTab === 'cod' && (
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-[#eff4ff]/60 rounded-xl border border-[#c3c6d7]/50 text-[12px]">
                <span className="font-bold text-[#0b1c30] block">Doorstep Cash / UPI Payment</span>
                <p className="text-[#434655] mt-0.5">
                  Pay cash or scan courier UPI QR upon physical receipt of your shipment.
                </p>
              </div>

              {/* Anti-fraud Captcha */}
              <div className="flex items-center gap-3">
                <div className="bg-[#0b1c30] text-[#89f5e7] px-4 py-2 rounded-lg font-mono font-black text-[18px] tracking-widest select-none">
                  {captchaCode}
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="Enter 4-digit code"
                  className="flex-1 bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2 text-[13px] font-mono focus:bg-white focus:border-[#004ac6] outline-none"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-[#c3c6d7]/40 flex gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-4 py-3 border border-[#c3c6d7] text-[#434655] font-bold text-[13px] rounded-xl hover:bg-[#eff4ff] transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              id="submit-payment-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleStartPayment}
              className="flex-1 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[14px] rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  {processingMessage || 'Securing Payment...'}
                </>
              ) : (
                <>
                  Pay ₹{totalAmount.toLocaleString('en-IN')}
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3D SECURE OTP SIMULATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d7] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-[#004ac6] text-[16px]">Verified by VISA</span>
                <span className="text-[12px] text-[#737686]">| HDFC 3D Secure</span>
              </div>
              <span className="material-symbols-outlined text-[#007b71] text-[20px]">shield</span>
            </div>

            <div className="text-center">
              <span className="text-[12px] text-[#434655]">
                Authenticating transaction of <strong className="text-[#0b1c30]">₹{totalAmount.toLocaleString('en-IN')}</strong> at <strong className="text-[#004ac6]">BuyZo Marketplace</strong>
              </span>
              <p className="text-[12px] text-[#737686] mt-1">
                Enter the One-Time Password sent to your registered mobile number:
              </p>
            </div>

            <div className="flex justify-center gap-2 my-2">
              {bankOtp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...bankOtp];
                    newOtp[idx] = e.target.value;
                    setBankOtp(newOtp);
                  }}
                  className="w-11 h-12 text-center text-[18px] font-black text-[#004ac6] bg-[#eff4ff] border border-[#c3c6d7] rounded-xl outline-none"
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-[12px] bg-[#eff4ff] p-2 rounded-lg border border-[#c3c6d7]/40">
              <span className="text-[#434655]">Bank OTP: <strong>5489</strong></span>
              <button
                type="button"
                onClick={() => setBankOtp(['5', '4', '8', '9'])}
                className="text-[#004ac6] font-bold hover:underline cursor-pointer"
              >
                Auto-fill Code
              </button>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 border border-[#c3c6d7] text-[#434655] font-bold text-[13px] rounded-xl hover:bg-[#eff4ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => finalizePayment('Card', 'Visa 3D-Secure')}
                className="flex-1 py-2.5 bg-[#004ac6] text-white font-bold text-[13px] rounded-xl hover:bg-[#2563eb]"
              >
                Authorize & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
