import React, { useState } from 'react';
import { Product, Order, AppView } from '../types';

interface SellerDashboardScreenProps {
  products: Product[];
  orders: Order[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onAddNewProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  setCurrentView: (view: AppView) => void;
}

export const SellerDashboardScreen: React.FC<SellerDashboardScreenProps> = ({
  products,
  orders,
  onUpdateProductStock,
  onAddNewProduct,
  onUpdateOrderStatus,
  setCurrentView,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New product form
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>(999);
  const [originalPrice, setOriginalPrice] = useState<number | string>(1499);
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('MyBrand');
  const [stock, setStock] = useState<number | string>(50);
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'
  );
  const [description, setDescription] = useState('');

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numPrice = Number(price);
    const numOrig = Number(originalPrice);
    const discount = numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : undefined;

    const newProd: Product = {
      id: `prod-seller-${Date.now()}`,
      name,
      price: numPrice,
      originalPrice: numOrig,
      discountPercent: discount,
      rating: 5.0,
      ratingCount: 1,
      image: image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
      category,
      brand,
      seller: {
        id: 'seller-custom',
        name: 'Apex Electronics & Fashion Hub',
        rating: 4.9,
        reviewsCount: 120,
        city: 'Mumbai',
        isVerified: true,
      },
      description: description || 'High quality certified genuine product on BuyZo.',
      deliveryTimeText: 'Free Delivery Tomorrow',
      inStock: true,
      stockCount: Number(stock),
      specifications: {
        Brand: brand,
        Category: category,
        Warranty: '1 Year Manufacturer',
      },
      reviews: [],
      tags: [category.toLowerCase(), brand.toLowerCase()],
    };

    onAddNewProduct(newProd);
    setIsAddModalOpen(false);
    // reset form
    setName('');
    setDescription('');
  };

  return (
    <div id="seller-dashboard-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-5xl mx-auto flex flex-col gap-4 sm:gap-5 w-full">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c3c6d7]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-['Public_Sans'] font-extrabold text-[18px] sm:text-[22px] text-[#0b1c30]">
              Seller Partner Hub
            </span>
            <span className="bg-[#007b71] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Verified Merchant
            </span>
            <span className="bg-[#eff4ff] text-[#004ac6] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#b4c5ff]">
              GST Verified
            </span>
          </div>
          <p className="text-[12px] sm:text-[13px] text-[#434655] mt-1 truncate">
            Store: <strong className="text-[#0b1c30]">Apex Electronics & Fashion Hub</strong> • Merchant ID: BZ-MER-9941
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('home')}
            className="flex-1 sm:flex-initial text-center py-2 px-3 text-[12px] font-bold text-[#004ac6] bg-[#eff4ff] hover:bg-[#dce9ff] rounded-xl transition-colors cursor-pointer"
          >
            ← Storefront
          </button>
          <button
            id="seller-add-product-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#004ac6] text-white px-3.5 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold hover:bg-[#2563eb] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Listing</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Fully Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Total Sales</span>
            <span className="material-symbols-outlined text-[18px] text-[#007b71]">payments</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#0b1c30] my-1">
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#007b71] font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            +18.4% this week
          </span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Orders</span>
            <span className="material-symbols-outlined text-[18px] text-[#004ac6]">local_shipping</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#0b1c30] my-1">
            {orders.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#004ac6] font-bold">100% On-Time Dispatch</span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Live Catalog</span>
            <span className="material-symbols-outlined text-[18px] text-[#fd761a]">inventory_2</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#0b1c30] my-1">
            {products.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#007b71] font-bold">All SKUs In Stock</span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Seller Score</span>
            <span className="material-symbols-outlined text-[18px] text-[#fd761a]">star</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#0b1c30] my-1 flex items-center gap-1">
            4.9 <span className="text-[12px] text-[#737686] font-normal">/ 5.0</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#737686] font-semibold">Tier 1 Elite Partner</span>
        </div>
      </div>

      {/* Tabs Switcher - Horizontal Scroll on Small Screens */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#c3c6d7]/40 pb-2 overflow-x-auto no-scrollbar">
        <button
          id="seller-tab-inventory"
          onClick={() => setActiveTab('inventory')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">inventory</span>
          Catalog Inventory ({products.length})
        </button>

        <button
          id="seller-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          Order Fulfillment ({orders.length})
        </button>

        <button
          id="seller-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">analytics</span>
          Payouts & Analytics
        </button>
      </div>

      {/* Tab 1: Catalog Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 sm:p-4 border-b border-[#c3c6d7]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[16px] text-[#0b1c30]">
                Live Product Inventory & Stock Management
              </h3>
              <p className="text-[11px] text-[#737686]">Instant multi-node inventory sync with customer applet</p>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#737686]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by title or brand..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#eff4ff] border border-[#c3c6d7] rounded-xl text-[12px] text-[#0b1c30] outline-none focus:bg-white focus:border-[#004ac6]"
              />
            </div>
          </div>

          {/* Responsive Card List (Mobile) & Table (Tablet/Desktop) */}
          <div className="divide-y divide-[#c3c6d7]/30">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8f9ff] transition-colors"
              >
                {/* Product Info */}
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-12 sm:h-12 rounded-xl object-cover bg-[#eff4ff] flex-shrink-0 border border-[#c3c6d7]/40"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-['Public_Sans'] font-semibold text-[13px] text-[#0b1c30] line-clamp-1">
                      {prod.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-[#737686]">
                      <span className="font-bold text-[#0b1c30]">₹{prod.price.toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span>{prod.category}</span>
                      {prod.brand && (
                        <>
                          <span>•</span>
                          <span>{prod.brand}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stock Controls & Status */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#c3c6d7]/20">
                  <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#c3c6d7]/60">
                    <span className="text-[11px] font-bold text-[#434655] px-1.5 hidden xs:inline">Units:</span>
                    <button
                      type="button"
                      onClick={() => onUpdateProductStock(prod.id, Math.max(0, (prod.stockCount || 0) - 5))}
                      className="w-6 h-6 rounded-lg bg-white text-[#0b1c30] hover:bg-[#dce9ff] text-[12px] font-bold flex items-center justify-center cursor-pointer border border-[#c3c6d7]/40 active:scale-95"
                      title="Decrease by 5"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={prod.stockCount ?? 0}
                      onChange={(e) => onUpdateProductStock(prod.id, Math.max(0, Number(e.target.value)))}
                      className="w-12 text-center text-[12px] font-black text-[#004ac6] bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateProductStock(prod.id, (prod.stockCount || 0) + 5)}
                      className="w-6 h-6 rounded-lg bg-white text-[#0b1c30] hover:bg-[#dce9ff] text-[12px] font-bold flex items-center justify-center cursor-pointer border border-[#c3c6d7]/40 active:scale-95"
                      title="Increase by 5"
                    >
                      +
                    </button>
                  </div>

                  <span
                    className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                      (prod.stockCount || 0) > 0
                        ? 'bg-[#89f5e7]/60 text-[#007b71]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {(prod.stockCount || 0) > 0 ? 'Active' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Orders Fulfillment */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 sm:p-4 border-b border-[#c3c6d7]/30 flex justify-between items-center">
            <div>
              <h3 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[16px] text-[#0b1c30]">
                Customer Orders & Dispatch Pipeline
              </h3>
              <p className="text-[11px] text-[#737686]">Update order fulfillment stages to notify customers instantly</p>
            </div>
            <span className="text-[11px] font-bold bg-[#eff4ff] text-[#004ac6] px-2.5 py-1 rounded-full">
              {orders.length} Active Orders
            </span>
          </div>

          <div className="divide-y divide-[#c3c6d7]/30">
            {orders.map((ord) => (
              <div key={ord.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-[13px] text-[#004ac6] bg-[#eff4ff] px-2 py-0.5 rounded">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-[#737686]">{ord.date}</span>
                    <span className="text-[10px] font-bold bg-[#dce9ff] text-[#004ac6] px-2 py-0.5 rounded">
                      {ord.paymentMethod}
                    </span>
                  </div>

                  <div className="mt-1.5 text-[12px] text-[#434655]">
                    <span className="font-semibold text-[#0b1c30]">{ord.deliveryAddress.fullName}</span> • {ord.deliveryAddress.city}, {ord.deliveryAddress.state} ({ord.deliveryAddress.pincode})
                  </div>

                  <div className="text-[12px] font-bold text-[#0b1c30] mt-0.5">
                    Order Total: ₹{ord.totalAmount.toLocaleString('en-IN')}
                    <span className="font-normal text-[11px] text-[#737686] ml-2">
                      ({ord.items.length} items)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#c3c6d7]/20">
                  <span className="text-[11px] font-bold text-[#434655]">Status:</span>
                  <select
                    value={ord.status}
                    onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                    className="bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-1.5 text-[12px] font-bold text-[#004ac6] outline-none cursor-pointer focus:bg-white focus:border-[#004ac6]"
                  >
                    <option value="Placed">Placed (New)</option>
                    <option value="Processing">Processing / Packed</option>
                    <option value="Shipped">Shipped / In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Payouts & Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30]">
                  Settlement & Payout Account
                </h3>
                <span className="bg-[#89f5e7]/60 text-[#007b71] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Auto-Deposit Active
                </span>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#b4c5ff]/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#737686] block">Linked Bank Account</span>
                  <span className="font-bold text-[13px] text-[#0b1c30]">HDFC Bank •••• 4092</span>
                  <span className="text-[10px] text-[#434655] block">IFSC: HDFC0000128 | Priya Patel</span>
                </div>
                <span className="material-symbols-outlined text-[24px] text-[#004ac6]">account_balance</span>
              </div>

              <div className="mt-3 space-y-2 text-[12px]">
                <div className="flex justify-between py-1 border-b border-[#c3c6d7]/20">
                  <span className="text-[#737686]">Next Payout Date:</span>
                  <span className="font-bold text-[#0b1c30]">Friday, 10:00 AM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#c3c6d7]/20">
                  <span className="text-[#737686]">Estimated Settlement:</span>
                  <span className="font-bold text-[#007b71]">₹{(totalGMV * 0.97).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#737686]">Platform Fee / TDS:</span>
                  <span className="font-semibold text-[#434655]">3% (Inclusive of GST)</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] text-[12px] font-bold rounded-xl transition-colors cursor-pointer">
              Download GST Invoices & TDS Statements
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 sm:p-5 shadow-xs">
            <h3 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30] mb-3">
              Performance & Fulfillment Health
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[12px] font-semibold mb-1">
                  <span className="text-[#434655]">Order Fulfillment Rate</span>
                  <span className="text-[#007b71] font-bold">99.4%</span>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#007b71] rounded-full" style={{ width: '99.4%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] font-semibold mb-1">
                  <span className="text-[#434655]">Return & Replacement Rate</span>
                  <span className="text-[#004ac6] font-bold">1.2% (Industry benchmark: 3.5%)</span>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#004ac6] rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] font-semibold mb-1">
                  <span className="text-[#434655]">Customer Satisfaction Score</span>
                  <span className="text-[#fd761a] font-bold">4.9 / 5.0</span>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fd761a] rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Listing Modal - Fully Responsive */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/50 pb-3">
              <div>
                <h3 className="font-['Public_Sans'] font-bold text-[16px] sm:text-[18px] text-[#0b1c30]">
                  Add New Product Listing
                </h3>
                <p className="text-[11px] text-[#737686]">Publish directly to BuyZo nationwide storefront</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#737686] hover:text-[#0b1c30] rounded-full cursor-pointer hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. BoAt Rockerz 450 Bluetooth Headphone"
                  className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-[#004ac6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-[#004ac6]"
                  />
                </div>
                <div>
                  <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    MRP / List Price (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-[#004ac6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-2.5 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-2.5 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
                  />
                </div>
                <div>
                  <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-2.5 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
                />
              </div>

              <div>
                <label className="text-[11px] sm:text-[12px] font-semibold text-[#0b1c30] block mb-1">
                  Key Description & Specifications
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key features, warranty, box contents..."
                  className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-xl px-3 py-2 text-[12px] outline-none focus:bg-white focus:border-[#004ac6]"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#c3c6d7] rounded-xl font-bold text-[13px] text-[#434655] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-bold text-[13px] transition-colors shadow-sm cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
