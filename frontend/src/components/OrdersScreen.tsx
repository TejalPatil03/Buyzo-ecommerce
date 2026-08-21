import React, { useState } from 'react';
import { Order, AppView, Product } from '../types';

interface OrdersScreenProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  setCurrentView: (view: AppView) => void;
  onAddToCart?: (product: Product) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  orders,
  onSelectOrder,
  setCurrentView,
  onAddToCart,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filterStatus === 'active') {
      if (order.status === 'Delivered' || order.status === 'Cancelled') return false;
    } else if (filterStatus === 'delivered') {
      if (order.status !== 'Delivered') return false;
    } else if (filterStatus === 'cancelled') {
      if (order.status !== 'Cancelled') return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchItem = order.items.some((it) => it.product.name.toLowerCase().includes(q));
      const matchMethod = order.paymentMethod.toLowerCase().includes(q);
      return matchOrderNum || matchItem || matchMethod;
    }

    return true;
  });

  const handleBuyAgain = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (onAddToCart && order.items.length > 0) {
      order.items.forEach((item) => {
        onAddToCart(item.product);
      });
      showToast(`Added ${order.items.length} item(s) from Order #${order.orderNumber} to your cart!`);
      setTimeout(() => setCurrentView('cart'), 800);
    }
  };

  const handleDownloadInvoice = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    showToast(`Invoice for Order #${order.orderNumber} downloaded successfully (PDF).`);
  };

  return (
    <div id="orders-screen" className="pt-16 pb-28 px-3 sm:px-4 max-w-3xl mx-auto flex flex-col gap-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#004ac6] text-white px-4 py-2.5 rounded-full shadow-lg text-[13px] font-['Inter'] font-semibold flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">info</span>
          {toastMessage}
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c3c6d7]/40 pb-3">
        <div>
          <h1 className="font-['Public_Sans'] font-black text-[20px] sm:text-[22px] text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[26px]">receipt_long</span>
            My Orders
            <span className="text-[13px] font-bold text-[#004ac6] bg-[#dce9ff] px-2.5 py-0.5 rounded-full">
              {orders.length}
            </span>
          </h1>
          <p className="text-[12px] text-[#737686]">Track live status, download invoices, or re-order</p>
        </div>

        <button
          onClick={() => setCurrentView('home')}
          className="self-start sm:self-auto text-[#004ac6] font-['Inter'] text-[13px] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-[#eff4ff] hover:bg-[#dce9ff] px-3 py-1.5 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          Shop Marketplace
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or product name..."
            className="w-full bg-white border border-[#c3c6d7] rounded-xl pl-9 pr-8 py-2 text-[13px] outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'active', label: 'In-Transit / Active' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'bg-white text-[#434655] border border-[#c3c6d7] hover:bg-[#eff4ff]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#c3c6d7]/60 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[36px] text-[#004ac6]">
              receipt_long
            </span>
          </div>
          <h3 className="font-['Public_Sans'] font-bold text-[17px] text-[#0b1c30] mb-1">
            {orders.length === 0 ? 'No orders placed yet' : 'No matching orders found'}
          </h3>
          <p className="font-['Public_Sans'] text-[13px] text-[#434655] max-w-sm mb-5">
            {orders.length === 0
              ? 'Browse our verified marketplace products and place your first order!'
              : 'Try clearing your search filters to view your other orders.'}
          </p>
          <button
            onClick={() => {
              if (orders.length === 0) setCurrentView('home');
              else {
                setFilterStatus('all');
                setSearchQuery('');
              }
            }}
            className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl font-['Inter'] text-[13px] font-bold transition-all shadow-md cursor-pointer"
          >
            {orders.length === 0 ? 'Start Shopping' : 'Clear Filters'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filteredOrders.map((order, idx) => {
            const isJustPlaced = order.date.toLowerCase().includes('just now') || idx === 0 && order.status === 'Placed';
            const isDelivered = order.status === 'Delivered';
            const isShipped = order.status === 'Shipped';
            const isCancelled = order.status === 'Cancelled';
            const isProcessing = order.status === 'Processing' || order.status === 'Placed';

            return (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                onClick={() => onSelectOrder(order)}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col gap-3.5 relative overflow-hidden ${
                  isJustPlaced
                    ? 'border-[#004ac6] ring-2 ring-[#dce9ff]'
                    : 'border-[#c3c6d7]/60 hover:border-[#004ac6]'
                }`}
              >
                {/* Just Placed Highlight Banner */}
                {isJustPlaced && (
                  <div className="bg-[#004ac6] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      Recently Confirmed Order
                    </span>
                    <span>Order Active</span>
                  </div>
                )}

                {/* Top Row: Order Number, Date & Status */}
                <div className="flex items-start sm:items-center justify-between gap-2 border-b border-[#c3c6d7]/30 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-['Inter'] font-black text-[14px] sm:text-[15px] text-[#0b1c30]">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[11px] font-bold text-[#004ac6] bg-[#eff4ff] px-2 py-0.5 rounded-md border border-[#b4c5ff]/50">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#737686] block mt-0.5">
                      Placed on: <strong className="text-[#434655]">{order.date}</strong>
                    </span>
                  </div>

                  <span
                    className={`font-['Inter'] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex-shrink-0 flex items-center gap-1 ${
                      isDelivered
                        ? 'bg-[#89f5e7]/60 text-[#007b71]'
                        : isShipped
                        ? 'bg-[#dce9ff] text-[#004ac6]'
                        : isCancelled
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#ffdbca] text-[#9d4300]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {isDelivered
                        ? 'check_circle'
                        : isShipped
                        ? 'local_shipping'
                        : isCancelled
                        ? 'cancel'
                        : 'pending'}
                    </span>
                    {order.status}
                  </span>
                </div>

                {/* Ordered Items Preview */}
                <div className="flex flex-col gap-2.5">
                  {order.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-xl bg-[#eff4ff] border border-[#c3c6d7]/30 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-['Public_Sans'] font-semibold text-[13px] text-[#0b1c30] line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-[#737686]">
                          Qty: {quantity} • ₹{product.price.toLocaleString('en-IN')} each
                        </p>
                        <p className="text-[11px] text-[#007b71] font-semibold">
                          Seller: {product.seller.name}
                        </p>
                      </div>
                      <span className="font-bold text-[13px] text-[#0b1c30] flex-shrink-0">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Summary & Total */}
                <div className="bg-[#f8f9ff] rounded-xl p-3 border border-[#c3c6d7]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                  <div className="text-[#434655] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                      location_on
                    </span>
                    <span>
                      Deliver to: <strong>{order.deliveryAddress.fullName}</strong>, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                    </span>
                  </div>
                  <div className="text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="text-[#737686] text-[11px]">Total Paid:</span>
                    <span className="font-['Public_Sans'] font-extrabold text-[15px] text-[#004ac6]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Return Status if any */}
                {order.returnStatus && order.returnStatus !== 'None' && (
                  <div className="bg-[#eff4ff] p-2.5 rounded-xl text-[11px] text-[#004ac6] font-semibold flex items-center justify-between border border-[#b4c5ff]/60">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">assignment_return</span>
                      <span>Return Status: <strong>{order.returnStatus}</strong></span>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#b4c5ff]">
                      Refund in progress
                    </span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-1 border-t border-[#c3c6d7]/30 gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleDownloadInvoice(e, order)}
                      className="text-[#434655] hover:text-[#004ac6] font-['Inter'] text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-[#c3c6d7] hover:bg-[#eff4ff] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      Invoice
                    </button>
                    {onAddToCart && (
                      <button
                        onClick={(e) => handleBuyAgain(e, order)}
                        className="text-[#007b71] hover:text-[#005f56] font-['Inter'] text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-[#89f5e7] bg-[#89f5e7]/20 hover:bg-[#89f5e7]/40 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">replay</span>
                        Buy Again
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectOrder(order)}
                    className="bg-[#004ac6] hover:bg-[#2563eb] text-white font-['Inter'] text-[12px] font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isDelivered ? 'visibility' : 'local_shipping'}
                    </span>
                    {isDelivered ? 'View Details' : 'Track Order'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
