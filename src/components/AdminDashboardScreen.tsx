import React, { useState } from 'react';
import { Product, Order, AppView } from '../types';

interface AdminDashboardScreenProps {
  products: Product[];
  orders: Order[];
  onApproveReturn: (orderId: string) => void;
  onRejectReturn: (orderId: string) => void;
  setCurrentView: (view: AppView) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  products,
  orders,
  onApproveReturn,
  onRejectReturn,
  setCurrentView,
}) => {
  const [activeTab, setActiveTab] = useState<'disputes' | 'sellers' | 'catalog' | 'system'>('disputes');

  const [sellersList, setSellersList] = useState([
    { id: 'sel-1', name: 'Apex Electronics Hub', city: 'Mumbai', gst: '27AADCB2230M1Z2', status: 'Approved', sales: '₹4,82,000', rating: 4.9 },
    { id: 'sel-2', name: 'MegaMart Daily Supermarket', city: 'Delhi NCR', gst: '07AALCM3918C1Z', status: 'Approved', sales: '₹3,15,400', rating: 4.8 },
    { id: 'sel-3', name: 'Patel Organic Groceries', city: 'Ahmedabad', gst: '24AAACP4912D1Z', status: 'Approved', sales: '₹1,90,000', rating: 4.7 },
    { id: 'sel-4', name: 'Urban Kraft & Fashion', city: 'Jaipur', gst: '08AAFCU2910F1Z', status: 'Under Review', sales: '₹42,000', rating: 4.5 },
    { id: 'sel-5', name: 'Southern Spices & Co', city: 'Bengaluru', gst: '29AAECE8192E1Z', status: 'Under Review', sales: '₹15,000', rating: 4.6 },
  ]);

  const pendingReturns = orders.filter(
    (o) => o.returnStatus === 'Requested' || (o.returnStatus && o.returnStatus !== 'None')
  );

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleToggleSellerStatus = (id: string) => {
    setSellersList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Approved' ? 'Suspended' : 'Approved' } : s))
    );
  };

  return (
    <div id="admin-dashboard-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-5xl mx-auto flex flex-col gap-4 sm:gap-5 w-full">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c3c6d7]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-['Public_Sans'] font-extrabold text-[18px] sm:text-[22px] text-[#0b1c30]">
              BuyZo Super Admin Console
            </h1>
            <span className="bg-[#2563eb] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Governance & Oversight
            </span>
          </div>
          <p className="text-[12px] sm:text-[13px] text-[#434655] mt-1">
            Platform Security, Dispute Resolution, GST Audit & Merchant Quality Control
          </p>
        </div>

        <button
          onClick={() => setCurrentView('home')}
          className="w-full sm:w-auto text-center py-2 px-3.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] text-[12px] sm:text-[13px] font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          Return to Marketplace
        </button>
      </div>

      {/* Platform KPIs - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Platform GMV</span>
            <span className="material-symbols-outlined text-[18px] text-[#007b71]">account_balance_wallet</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#0b1c30] my-1">
            ₹{(totalGMV + 1420000).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#007b71] font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            +24.8% YoY Growth
          </span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Verified Merchants</span>
            <span className="material-symbols-outlined text-[18px] text-[#004ac6]">verified</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#0b1c30] my-1">
            428 Sellers
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#007b71] font-bold">2 Under Review</span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Active Listings</span>
            <span className="material-symbols-outlined text-[18px] text-[#fd761a]">apps</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#0b1c30] my-1">
            {(products.length * 150 + 1200).toLocaleString('en-IN')} SKUs
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#004ac6] font-bold">100% Quality Checked</span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#c3c6d7]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#737686] uppercase tracking-wider">Open Disputes</span>
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">shield_person</span>
          </div>
          <div className="font-['Public_Sans'] font-black text-[18px] sm:text-[22px] text-[#ba1a1a] my-1">
            {pendingReturns.length} Requests
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#737686] font-semibold">Target &lt; 24hr SLA</span>
        </div>
      </div>

      {/* Tabs Switcher - Horizontal Scroll on Small Screens */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#c3c6d7]/40 pb-2 overflow-x-auto no-scrollbar">
        <button
          id="admin-tab-disputes"
          onClick={() => setActiveTab('disputes')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'disputes'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          Dispute Desk ({pendingReturns.length})
        </button>

        <button
          id="admin-tab-sellers"
          onClick={() => setActiveTab('sellers')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sellers'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          Seller KYC & Audits ({sellersList.length})
        </button>

        <button
          id="admin-tab-catalog"
          onClick={() => setActiveTab('catalog')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          Catalog Moderation ({products.length})
        </button>

        <button
          id="admin-tab-system"
          onClick={() => setActiveTab('system')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'system'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
          System Telemetry
        </button>
      </div>

      {/* Tab 1: Dispute Desk */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 sm:p-4 border-b border-[#c3c6d7]/30 flex justify-between items-center">
            <div>
              <h3 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[16px] text-[#0b1c30]">
                Customer Refund & Replacement Requests
              </h3>
              <p className="text-[11px] text-[#737686]">Instant arbitration with real-time customer and seller notifications</p>
            </div>
            <span className="text-[11px] font-bold bg-[#ffdad6] text-[#ba1a1a] px-2.5 py-1 rounded-full">
              {pendingReturns.length} Action Needed
            </span>
          </div>

          {pendingReturns.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-[#89f5e7]/40 text-[#007b71] flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#0b1c30]">All Disputes Resolved!</h4>
              <p className="text-[12px] text-[#737686] mt-1">No pending return requests require super admin intervention right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#c3c6d7]/30">
              {pendingReturns.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8f9ff] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[13px] text-[#004ac6] bg-[#eff4ff] px-2 py-0.5 rounded">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="bg-[#ffdbca] text-[#9d4300] text-[10px] font-bold px-2 py-0.5 rounded">
                        Reason: {ord.returnStatus}
                      </span>
                      <span className="text-[11px] text-[#737686]">{ord.date}</span>
                    </div>

                    <div className="mt-1 text-[12px] text-[#434655]">
                      Customer: <strong className="text-[#0b1c30]">{ord.deliveryAddress.fullName}</strong> • {ord.deliveryAddress.city}
                    </div>

                    <div className="text-[12px] font-bold text-[#0b1c30] mt-0.5">
                      Refund Amount: ₹{ord.totalAmount.toLocaleString('en-IN')}
                      <span className="font-normal text-[11px] text-[#737686] ml-2">
                        (Item: {ord.items[0]?.product.name || 'Purchased SKU'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#c3c6d7]/20">
                    <button
                      id={`admin-reject-btn-${ord.id}`}
                      onClick={() => onRejectReturn(ord.id)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6]/30 text-[12px] font-bold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Reject Claim
                    </button>
                    <button
                      id={`admin-approve-btn-${ord.id}`}
                      onClick={() => onApproveReturn(ord.id)}
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-[#007b71] hover:bg-[#005f56] text-white text-[12px] font-bold rounded-xl transition-colors shadow-xs cursor-pointer text-center"
                    >
                      Approve Refund
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Seller KYC & Audits */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 sm:p-4 border-b border-[#c3c6d7]/30 flex justify-between items-center">
            <div>
              <h3 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[16px] text-[#0b1c30]">
                Registered Sellers & GSTIN Audits
              </h3>
              <p className="text-[11px] text-[#737686]">Verify government business registrations and warehouse compliance</p>
            </div>
          </div>

          <div className="divide-y divide-[#c3c6d7]/30">
            {sellersList.map((s) => (
              <div
                key={s.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8f9ff] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[13px] text-[#0b1c30]">{s.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        s.status === 'Approved'
                          ? 'bg-[#89f5e7]/60 text-[#007b71]'
                          : s.status === 'Under Review'
                          ? 'bg-[#ffdbca] text-[#9d4300]'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] text-[#737686]">
                    <span className="font-mono">GST: {s.gst}</span>
                    <span>•</span>
                    <span>City: {s.city}</span>
                    <span>•</span>
                    <span>Volume: {s.sales}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-[#fd761a] font-bold">
                      <span className="material-symbols-outlined text-[13px] fill">star</span>
                      {s.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#c3c6d7]/20">
                  <button
                    onClick={() => handleToggleSellerStatus(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                      s.status === 'Approved'
                        ? 'border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6]/30'
                        : 'bg-[#007b71] text-white hover:bg-[#005f56]'
                    }`}
                  >
                    {s.status === 'Approved' ? 'Suspend Store' : 'Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Catalog Moderation */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 sm:p-4 border-b border-[#c3c6d7]/30 flex justify-between items-center">
            <div>
              <h3 className="font-['Public_Sans'] font-bold text-[14px] sm:text-[16px] text-[#0b1c30]">
                Catalog Moderation & AI Safety Check
              </h3>
              <p className="text-[11px] text-[#737686]">Automated safety, counterfeit detection & price gouging checks</p>
            </div>
            <span className="text-[11px] font-bold bg-[#89f5e7]/60 text-[#007b71] px-2.5 py-1 rounded-full">
              AI Guardian Active
            </span>
          </div>

          <div className="divide-y divide-[#c3c6d7]/30">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#f8f9ff]">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-[#eff4ff] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-[13px] text-[#0b1c30] truncate">{p.name}</h4>
                    <span className="text-[11px] text-[#737686]">
                      ₹{p.price.toLocaleString('en-IN')} • {p.category} • {p.seller?.name || 'Apex Store'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:inline text-[10px] font-bold bg-[#89f5e7]/60 text-[#007b71] px-2 py-0.5 rounded">
                    Genuine Verified
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-[#007b71]">check_circle</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Telemetry */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/60 shadow-xs">
            <span className="text-[11px] font-bold text-[#737686] uppercase">API Gateway Uptime</span>
            <div className="font-black text-[22px] text-[#007b71] mt-1">99.99%</div>
            <p className="text-[11px] text-[#434655] mt-1">Cloud Run multi-region latency: 24ms</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/60 shadow-xs">
            <span className="text-[11px] font-bold text-[#737686] uppercase">UPI / Card Gateway</span>
            <div className="font-black text-[22px] text-[#004ac6] mt-1">Operational</div>
            <p className="text-[11px] text-[#434655] mt-1">Razorpay / NPCI live health normal</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/60 shadow-xs">
            <span className="text-[11px] font-bold text-[#737686] uppercase">AI Shopping Engine</span>
            <div className="font-black text-[22px] text-[#007b71] mt-1">Connected</div>
            <p className="text-[11px] text-[#434655] mt-1">Product semantic index in sync</p>
          </div>
        </div>
      )}
    </div>
  );
};
