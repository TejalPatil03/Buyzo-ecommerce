import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole, AppView } from '../types';

interface AuthScreenProps {
  currentUser?: UserProfile | null;
  onLoginSuccess?: (user: UserProfile) => void;
  onAuthSuccess?: (user: UserProfile) => void;
  onLogout?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  setCurrentView?: (view: AppView) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLoginSuccess,
  onAuthSuccess,
  onLogout,
  onClose,
  onCancel,
  setCurrentView,
  initialMode = 'signin',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Input states
  const [phone, setPhone] = useState('9820145678');
  const [email, setEmail] = useState('tejal.patil@example.com');
  const [password, setPassword] = useState('buyzo@2026');
  const [fullName, setFullName] = useState('Tejal Patil');
  const [storeName, setStoreName] = useState('Apex Retailers Hub');
  const [gstin, setGstin] = useState('27AADCB2230M1Z2');
  const [city, setCity] = useState('Mumbai');
  const [showPassword, setShowPassword] = useState(false);

  // OTP flow state
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Refs for OTP inputs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSuccess = (user: UserProfile) => {
    if (onAuthSuccess) onAuthSuccess(user);
    if (onLoginSuccess) onLoginSuccess(user);
    if (setCurrentView) {
      if (user.role === 'seller') setCurrentView('seller-dashboard');
      else if (user.role === 'admin') setCurrentView('admin-dashboard');
      else setCurrentView('home');
    }
    if (onClose) onClose();
  };

  const handleDismiss = () => {
    if (onCancel) onCancel();
    else if (onClose) onClose();
    else if (setCurrentView) setCurrentView('home');
  };

  // Instant 1-Click Fast Login
  const handleQuickDemoLogin = (role: UserRole) => {
    let demoUser: UserProfile;
    if (role === 'seller') {
      demoUser = {
        id: 'user-seller-priya',
        fullName: 'Priya Patel',
        email: 'priya.patel@apexretail.in',
        phone: '9823456789',
        role: 'seller',
        avatarLetter: 'P',
        isVip: true,
        sellerStoreName: 'Apex Electronics & Fashion Hub',
        gstin: '27AADCB2230M1Z2',
        city: 'Mumbai',
      };
    } else if (role === 'admin') {
      demoUser = {
        id: 'user-admin-vikram',
        fullName: 'Vikram Singh',
        email: 'admin.vikram@buyzo.in',
        phone: '9912345678',
        role: 'admin',
        avatarLetter: 'V',
        isVip: true,
        city: 'Bangalore',
      };
    } else {
      demoUser = {
        id: 'user-shopper-tejal',
        fullName: 'Tejal Patil',
        email: 'tejal.patil@example.com',
        phone: '9820145678',
        role: 'customer',
        avatarLetter: 'T',
        isVip: true,
        city: 'Mumbai',
      };
    }
    handleSuccess(demoUser);
  };

  // Pre-fill demo data on role switch for fast testing
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'seller') {
      setFullName('Priya Patel');
      setEmail('priya.patel@apexretail.in');
      setPhone('9823456789');
      setStoreName('Apex Electronics & Fashion Hub');
      setGstin('27AADCB2230M1Z2');
      setCity('Mumbai');
    } else if (role === 'admin') {
      setFullName('Vikram Singh');
      setEmail('admin.vikram@buyzo.in');
      setPhone('9912345678');
      setCity('Bangalore');
    } else {
      setFullName('Tejal Patil');
      setEmail('tejal.patil@example.com');
      setPhone('9820145678');
      setCity('Mumbai');
    }
  };

  // Instant OTP Request
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (authMethod === 'phone' && (!phone || phone.replace(/\D/g, '').length < 10)) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (authMethod === 'email' && (!email || !email.includes('@'))) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setStep('otp');
    setTimer(30);
    setSuccessMsg(`Instant OTP sent to ${authMethod === 'phone' ? `+91 ${phone}` : email}`);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 50);
  };

  // Instant OTP Verification
  const handleVerifyOtpAndLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code (Demo: 123456)');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName:
        authMode === 'signup'
          ? fullName || (selectedRole === 'seller' ? 'Priya Patel' : selectedRole === 'admin' ? 'Vikram Singh' : 'Tejal Patil')
          : selectedRole === 'seller'
          ? 'Priya Patel'
          : selectedRole === 'admin'
          ? 'Vikram Singh'
          : 'Tejal Patil',
      email: email || 'user@buyzo.in',
      phone: phone || '9820145678',
      role: selectedRole,
      avatarLetter: (fullName[0] || (selectedRole === 'seller' ? 'P' : selectedRole === 'admin' ? 'V' : 'T')).toUpperCase(),
      isVip: true,
      sellerStoreName: selectedRole === 'seller' ? storeName : undefined,
      gstin: selectedRole === 'seller' ? gstin : undefined,
      city: city,
    };
    handleSuccess(newUser);
  };

  // Handle Pasting OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      if (pastedData.length === 6) {
        // Auto-verify when all 6 digits pasted
        setTimeout(() => handleVerifyOtpAndLogin(), 50);
      }
    }
  };

  // Handle single OTP digit change
  const handleOtpChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = digit;
    setOtp(newOtp);

    // Auto-focus next
    if (digit && idx < 5) {
      otpInputRefs.current[idx + 1]?.focus();
    }

    // Auto-submit if all 6 digits filled
    if (digit && idx === 5 && newOtp.every((d) => d.length === 1)) {
      setTimeout(() => handleVerifyOtpAndLogin(), 50);
    }
  };

  // Handle backspace in OTP input
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpInputRefs.current[idx - 1]?.focus();
    }
  };

  // Instant Email/Password submit
  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: fullName || (selectedRole === 'seller' ? 'Priya Patel' : selectedRole === 'admin' ? 'Vikram Singh' : 'Tejal Patil'),
      email: email,
      phone: phone || '9820145678',
      role: selectedRole,
      avatarLetter: (fullName[0] || (selectedRole === 'seller' ? 'P' : selectedRole === 'admin' ? 'V' : 'T')).toUpperCase(),
      isVip: true,
      sellerStoreName: selectedRole === 'seller' ? storeName : undefined,
      gstin: selectedRole === 'seller' ? gstin : undefined,
      city: city,
    };
    handleSuccess(newUser);
  };

  // If already logged in, show user account profile card
  if (currentUser) {
    return (
      <div id="auth-screen" className="pt-16 pb-24 px-3 sm:px-4 max-w-lg mx-auto flex flex-col gap-4 animate-in fade-in duration-100">
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-5 sm:p-6 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-['Public_Sans'] font-extrabold text-[32px] mx-auto shadow-md">
            {currentUser.avatarLetter || 'U'}
          </div>
          <h2 className="font-['Public_Sans'] font-bold text-[20px] text-[#0b1c30] mt-3">
            {currentUser.fullName}
          </h2>
          <p className="text-[13px] text-[#434655]">{currentUser.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-[#89f5e7]/60 text-[#007b71] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              {currentUser.role === 'customer' ? 'BuyZo VIP Shopper' : `${currentUser.role} Account`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6">
            <button
              onClick={() => setCurrentView && setCurrentView('profile')}
              className="py-2.5 px-4 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] font-bold rounded-xl text-[13px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              View Profile
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="py-2.5 px-4 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-bold rounded-xl text-[13px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="auth-screen"
      className="pt-16 pb-24 px-3 sm:px-4 max-w-xl mx-auto flex flex-col gap-4 animate-in fade-in duration-100"
    >
      {/* Top Header & Fast Dismiss */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleDismiss}
          className="flex items-center gap-1 text-[13px] font-bold text-[#434655] hover:text-[#004ac6] p-1 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back to Store</span>
        </button>

        <div className="flex items-center gap-1.5 text-[#004ac6] font-['Public_Sans'] font-black text-[22px]">
          BuyZo
          <span className="bg-[#004ac6] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
            Fast Auth
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#434655] hover:text-[#0b1c30] flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* ⚡ INSTANT 1-CLICK FAST LOGIN TILES (Zero Typing Required) */}
      <div className="bg-gradient-to-r from-[#eef4ff] via-[#dce9ff] to-[#eff4ff] border-2 border-[#004ac6]/30 rounded-2xl p-3.5 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-[12px] font-bold">
              ⚡
            </span>
            <span className="font-['Public_Sans'] font-black text-[13px] sm:text-[14px] text-[#004ac6]">
              Instant 1-Click Fast Login
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-extrabold bg-[#004ac6] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
            Zero Wait
          </span>
        </div>

        <p className="text-[11px] sm:text-[12px] text-[#434655] mb-2.5 leading-snug">
          Select any profile to authenticate immediately and access features:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            id="instant-login-shopper"
            onClick={() => handleQuickDemoLogin('customer')}
            className="p-2.5 bg-white hover:bg-[#004ac6] hover:text-white text-[#004ac6] font-bold rounded-xl border border-[#004ac6]/40 transition-all flex items-center gap-2.5 cursor-pointer shadow-xs active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#eff4ff] group-hover:bg-white text-[#004ac6] flex items-center justify-center font-extrabold text-[13px] flex-shrink-0">
              T
            </div>
            <div className="text-left leading-tight min-w-0">
              <span className="block text-[12px] font-extrabold truncate">Tejal (Shopper)</span>
              <span className="text-[10px] opacity-80 font-normal block truncate">1-Click Customer</span>
            </div>
          </button>

          <button
            type="button"
            id="instant-login-seller"
            onClick={() => handleQuickDemoLogin('seller')}
            className="p-2.5 bg-white hover:bg-[#fd761a] hover:text-white text-[#9d4300] font-bold rounded-xl border border-[#ffdbca] transition-all flex items-center gap-2.5 cursor-pointer shadow-xs active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#fff8f5] group-hover:bg-white text-[#fd761a] flex items-center justify-center font-extrabold text-[13px] flex-shrink-0">
              P
            </div>
            <div className="text-left leading-tight min-w-0">
              <span className="block text-[12px] font-extrabold truncate">Priya (Seller Hub)</span>
              <span className="text-[10px] opacity-80 font-normal block truncate">1-Click Merchant</span>
            </div>
          </button>

          <button
            type="button"
            id="instant-login-admin"
            onClick={() => handleQuickDemoLogin('admin')}
            className="p-2.5 bg-white hover:bg-[#007b71] hover:text-white text-[#005f56] font-bold rounded-xl border border-[#89f5e7] transition-all flex items-center gap-2.5 cursor-pointer shadow-xs active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#e6f7f5] group-hover:bg-white text-[#007b71] flex items-center justify-center font-extrabold text-[13px] flex-shrink-0">
              V
            </div>
            <div className="text-left leading-tight min-w-0">
              <span className="block text-[12px] font-extrabold truncate">Vikram (Admin)</span>
              <span className="text-[10px] opacity-80 font-normal block truncate">1-Click Governance</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-sm p-4 sm:p-6 w-full">
        {/* Toggle Mode: Sign In vs Sign Up */}
        <div className="flex bg-[#eff4ff] p-1 rounded-xl mb-4 border border-[#c3c6d7]/40">
          <button
            id="auth-tab-signin"
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setStep('form');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 sm:py-2.5 rounded-lg text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer text-center ${
              authMode === 'signin'
                ? 'bg-white text-[#004ac6] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setStep('form');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 sm:py-2.5 rounded-lg text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer text-center ${
              authMode === 'signup'
                ? 'bg-white text-[#004ac6] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            Create New Account (Sign Up)
          </button>
        </div>

        {/* Account Role Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] sm:text-[12px] font-bold text-[#434655]">
              {authMode === 'signup' ? 'Select Registration Role:' : 'Account Portal:'}
            </label>
            <span className="text-[10px] font-bold text-[#004ac6] bg-[#dce9ff] px-2 py-0.5 rounded-full">
              {selectedRole === 'seller' ? 'Seller Merchant' : selectedRole === 'admin' ? 'Super Admin' : 'Shopper'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
            {[
              { role: 'customer', label: 'Shopper', sub: 'Buy & Track', icon: 'shopping_bag', color: 'text-[#004ac6]' },
              { role: 'seller', label: 'Seller Hub', sub: 'Sell & Earn', icon: 'storefront', color: 'text-[#fd761a]' },
              { role: 'admin', label: 'Admin', sub: 'Governance', icon: 'admin_panel_settings', color: 'text-[#007b71]' },
            ].map((item) => (
              <button
                key={item.role}
                id={`role-btn-${item.role}`}
                type="button"
                onClick={() => handleRoleSelect(item.role as UserRole)}
                className={`py-2 px-1.5 sm:py-2.5 sm:px-3 rounded-xl border flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all cursor-pointer text-center ${
                  selectedRole === item.role
                    ? 'border-[#004ac6] bg-[#eff4ff] text-[#004ac6] ring-2 ring-[#004ac6]/30 shadow-xs'
                    : 'border-[#c3c6d7]/60 text-[#434655] hover:bg-[#f8f9ff] hover:border-[#c3c6d7]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] sm:text-[22px] ${item.color}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-[11px] sm:text-[12px] leading-tight block truncate w-full">
                  {item.label}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#737686] hidden xs:block truncate">
                  {item.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Method Toggle: Mobile OTP vs Email */}
        <div className="flex justify-center gap-4 sm:gap-8 text-[12px] font-semibold text-[#434655] mb-4 border-b border-[#c3c6d7]/30 pb-2.5">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setStep('form');
            }}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors py-1 ${
              authMethod === 'phone'
                ? 'text-[#004ac6] font-bold border-b-2 border-[#004ac6] -mb-3 pb-2'
                : 'hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">smartphone</span>
            Mobile OTP (Fastest)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setStep('form');
            }}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors py-1 ${
              authMethod === 'email'
                ? 'text-[#004ac6] font-bold border-b-2 border-[#004ac6] -mb-3 pb-2'
                : 'hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">mail</span>
            Email & Password
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-3 p-3 bg-[#ffdad6] text-[#ba1a1a] text-[12px] rounded-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] flex-shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-3 p-3 bg-[#89f5e7]/30 text-[#007b71] text-[12px] rounded-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] flex-shrink-0">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* ======================================================= */}
        {/* STEP 1: FORM (PHONE OR EMAIL)                           */}
        {/* ======================================================= */}
        {step === 'form' && (
          <>
            {authMethod === 'phone' ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
                {/* Full Name for Sign Up */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tejal Patil"
                      className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0b1c30] focus:bg-white focus:border-[#004ac6] outline-none transition-all"
                    />
                  </div>
                )}

                {/* Additional Seller Fields for Sign Up */}
                {authMode === 'signup' && selectedRole === 'seller' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#f8f9ff] p-3 rounded-xl border border-[#c3c6d7]/50">
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] mb-1">
                        Store / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Apex Retail Hub"
                        className="w-full bg-white border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] text-[#0b1c30] focus:border-[#004ac6] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] mb-1">
                        GSTIN / PAN *
                      </label>
                      <input
                        type="text"
                        required
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="27AADCB2230M1Z2"
                        className="w-full bg-white border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] text-[#0b1c30] focus:border-[#004ac6] outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Phone Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0b1c30]">
                      10-Digit Mobile Number *
                    </label>
                    <span className="text-[10px] text-[#004ac6] font-semibold">Pre-filled for fast testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2.5 text-[13px] font-bold text-[#434655] flex-shrink-0">
                      🇮🇳 +91
                    </span>
                    <input
                      id="auth-phone-input"
                      type="tel"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98201 45678"
                      className="flex-1 min-w-0 bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0b1c30] font-semibold tracking-wider focus:bg-white focus:border-[#004ac6] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex gap-2 mt-1">
                  <button
                    id="auth-send-otp-btn"
                    type="submit"
                    className="flex-1 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[14px] rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{authMode === 'signup' ? 'Send OTP & Register' : 'Get Instant OTP'}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(selectedRole)}
                    className="py-3 px-3.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] font-bold text-[13px] rounded-xl border border-[#c3c6d7]/60 transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                    title="Bypass OTP and sign in immediately"
                  >
                    <span>⚡ Skip OTP</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEmailPasswordSubmit} className="flex flex-col gap-3">
                {/* Full Name for Sign Up */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tejal Patil"
                      className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0b1c30] focus:bg-white focus:border-[#004ac6] outline-none"
                    />
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0b1c30] focus:bg-white focus:border-[#004ac6] outline-none"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30]">Password *</label>
                    <span className="text-[10px] text-[#004ac6] font-semibold">Demo password pre-filled</span>
                  </div>
                  <div className="relative">
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0b1c30] focus:bg-white focus:border-[#004ac6] outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#0b1c30] p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="auth-email-submit-btn"
                  type="submit"
                  className="w-full mt-1 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[14px] rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  {authMode === 'signin' ? 'Sign In Instantly' : 'Complete Instant Registration'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            )}
          </>
        )}

        {/* ======================================================= */}
        {/* STEP 2: FAST OTP VERIFICATION                           */}
        {/* ======================================================= */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtpAndLogin} className="flex flex-col gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#dce9ff] text-[#004ac6] flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <h3 className="font-['Public_Sans'] font-bold text-[15px] sm:text-[16px] text-[#0b1c30]">
                Enter 6-Digit Verification Code
              </h3>
              <p className="text-[12px] text-[#434655] mt-0.5">
                Sent to <span className="font-bold text-[#0b1c30]">{authMethod === 'phone' ? `+91 ${phone}` : email}</span>
              </p>
            </div>

            {/* 6 Digit OTP Input Grid with paste & auto-tab support */}
            <div className="flex justify-center gap-1.5 xs:gap-2 sm:gap-3 my-1" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className="w-10 xs:w-11 sm:w-12 h-11 sm:h-12 text-center text-[16px] sm:text-[18px] font-black text-[#004ac6] bg-[#eff4ff] border border-[#c3c6d7] rounded-xl focus:bg-white focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
                />
              ))}
            </div>

            {/* Fast Auto-fill Helper */}
            <div className="flex items-center justify-between text-[11px] sm:text-[12px] bg-[#eff4ff] p-2.5 rounded-lg border border-[#c3c6d7]/50">
              <span className="text-[#434655] font-medium">Demo Code: <strong>123456</strong></span>
              <button
                type="button"
                onClick={() => {
                  setOtp(['1', '2', '3', '4', '5', '6']);
                  setTimeout(() => handleVerifyOtpAndLogin(), 50);
                }}
                className="text-[#004ac6] font-bold hover:underline cursor-pointer"
              >
                Auto-fill & Login Now
              </button>
            </div>

            {/* Timer & Back */}
            <div className="flex justify-between items-center text-[11px] sm:text-[12px]">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-[#737686] hover:text-[#0b1c30] font-medium cursor-pointer"
              >
                ← Back / Edit Details
              </button>
              {timer > 0 ? (
                <span className="text-[#737686]">Resend in <strong>{timer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(30)}
                  className="text-[#004ac6] font-bold hover:underline cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Verify & Enter Button */}
            <button
              id="auth-verify-otp-btn"
              type="submit"
              className="w-full py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-[14px] rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              Verify & Open {selectedRole === 'seller' ? 'Seller Hub' : selectedRole === 'admin' ? 'Admin Console' : 'Store'}
              <span className="material-symbols-outlined text-[18px]">check</span>
            </button>
          </form>
        )}

        {/* Continue as Guest */}
        <div className="mt-4 pt-3 text-center border-t border-[#c3c6d7]/40 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-[12px] font-semibold text-[#737686] hover:text-[#004ac6] cursor-pointer transition-colors"
          >
            ← Continue Shopping as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
