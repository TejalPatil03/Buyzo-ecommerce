import React, { useState } from 'react';
import { Order, AppView } from '../types';

interface OrderDetailScreenProps {
  order: Order;
  onBack: () => void;
  onCancelOrder: (orderId: string) => void;
  onRequestReturn: (orderId: string, reason: string) => void;
  setCurrentView: (view: AppView) => void;
}

export const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({
  order,
  onBack,
  onCancelOrder,
  onRequestReturn,
  setCurrentView,
}) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Damaged item');
  const [returnNotes, setReturnNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canCancel = order.status === 'Placed' || order.status === 'Processing';
  const canReturn = order.status === 'Delivered' && (!order.returnStatus || order.returnStatus === 'None');

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestReturn(order.id, `${returnReason}: ${returnNotes}`);
    setIsReturnModalOpen(false);
    setToastMessage('Return / refund request submitted successfully! Pickup will be scheduled.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancelClick = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      onCancelOrder(order.id);
      setToastMessage('Order cancelled. Refund initiated to original payment method.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div id="order-detail-screen" className="pt-16 pb-28 px-4 max-w-3xl mx-auto flex flex-col gap-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#004ac6] text-white px-4 py-2 rounded-full shadow-lg text-[13px] font-['Inter'] font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          {toastMessage}
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-xl border border-[#c3c6d7]/60 p-4 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Public_Sans'] font-bold text-[18px] text-[#0b1c30]">
              Order #{order.orderNumber}
            </h1>
            <span className="text-[12px] text-[#737686]">{order.date}</span>
          </div>

          <span
            className={`font-['Inter'] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              order.status === 'Delivered'
                ? 'bg-[#89f5e7]/60 text-[#007b71]'
                : order.status === 'Shipped'
                ? 'bg-[#dce9ff] text-[#004ac6]'
                : order.status === 'Cancelled'
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : 'bg-[#ffdbca] text-[#9d4300]'
            }`}
          >
            {order.status}
          </span>
        </div>

        {order.returnStatus && order.returnStatus !== 'None' && (
          <div className="bg-[#eff4ff] border border-[#b4c5ff] p-3 rounded-lg text-[13px] text-[#004ac6] font-semibold flex items-center justify-between">
            <span>Return Request Status: <strong>{order.returnStatus}</strong></span>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-[#b4c5ff]">
              Refund Processing
            </span>
          </div>
        )}
      </div>

      {/* Live Stepper Tracking Timeline */}
      <div className="bg-white rounded-xl border border-[#c3c6d7]/60 p-4 shadow-xs">
        <h2 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6]">local_shipping</span>
          Live Shipment Tracking
        </h2>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c3c6d7]">
          {order.trackingEvents.map((evt, idx) => (
            <div key={idx} className="relative flex flex-col gap-1">
              <div
                className={`absolute -left-[23px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  evt.completed
                    ? 'bg-[#004ac6]'
                    : evt.current
                    ? 'bg-[#fd761a] ring-4 ring-[#ffdbca]'
                    : 'bg-[#c3c6d7]'
                }`}
              >
                {evt.completed ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <h4 className="font-['Inter'] font-bold text-[13px] text-[#0b1c30]">{evt.title}</h4>
                <span className="text-[11px] text-[#737686] font-medium">{evt.timestamp}</span>
              </div>
              <p className="text-[12px] text-[#434655]">{evt.description}</p>
              <span className="text-[11px] text-[#737686]">Location: {evt.location}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items in this order */}
      <div className="bg-white rounded-xl border border-[#c3c6d7]/60 p-4 shadow-xs">
        <h2 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30] mb-3">
          Ordered Items ({order.items.length})
        </h2>
        <div className="divide-y divide-[#c3c6d7]/30">
          {order.items.map(({ product, quantity }) => (
            <div key={product.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover bg-[#eff4ff]"
                />
                <div>
                  <h3 className="font-['Public_Sans'] font-semibold text-[13px] text-[#0b1c30] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-[#737686]">Seller: {product.seller.name}</p>
                  <p className="text-[12px] font-bold text-[#0b1c30] mt-0.5">
                    ₹{product.price.toLocaleString('en-IN')} × {quantity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Rating product: ${product.name}`);
                }}
                className="text-[#004ac6] border border-[#004ac6] px-3 py-1 rounded-full text-[11px] font-bold hover:bg-[#eff4ff]"
              >
                Write Review
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Payment Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-[#c3c6d7]/60 p-4 shadow-xs">
          <h3 className="font-['Public_Sans'] font-bold text-[13px] text-[#0b1c30] mb-2">
            Delivery Address
          </h3>
          <p className="text-[12px] font-semibold text-[#0b1c30]">
            {order.deliveryAddress.fullName} ({order.deliveryAddress.type})
          </p>
          <p className="text-[12px] text-[#434655] mt-1 leading-snug">
            {order.deliveryAddress.addressLine1}, {order.deliveryAddress.city},{' '}
            {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
          </p>
          <p className="text-[11px] text-[#737686] mt-1">Phone: {order.deliveryAddress.phone}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#c3c6d7]/60 p-4 shadow-xs">
          <h3 className="font-['Public_Sans'] font-bold text-[13px] text-[#0b1c30] mb-2">
            Payment & Total
          </h3>
          <p className="text-[12px] text-[#434655]">
            Method: <strong>{order.paymentMethod}</strong>
          </p>
          <p className="text-[12px] text-[#434655] mt-1">
            Total Paid:{' '}
            <strong className="text-[#0b1c30] text-[14px]">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </strong>
          </p>
          <button
            onClick={() => alert(`Invoice #INV-${order.orderNumber}.pdf downloaded.`)}
            className="mt-3 text-[#004ac6] font-['Inter'] text-[12px] font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download Tax Invoice
          </button>
        </div>
      </div>

      {/* Actions (Cancel / Return) */}
      <div className="flex gap-3 mt-2">
        {canCancel && (
          <button
            onClick={handleCancelClick}
            className="flex-1 py-3 border border-[#ba1a1a] text-[#ba1a1a] font-['Inter'] font-bold text-[13px] rounded-lg hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
          >
            Cancel Order
          </button>
        )}
        {canReturn && (
          <button
            onClick={() => setIsReturnModalOpen(true)}
            className="flex-1 py-3 bg-[#004ac6] text-white font-['Inter'] font-bold text-[13px] rounded-lg hover:bg-[#2563eb] transition-colors cursor-pointer"
          >
            Request Return / Refund
          </button>
        )}
      </div>

      {/* Return Modal Dialog */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/50 pb-2">
              <h3 className="font-['Public_Sans'] font-bold text-[16px] text-[#0b1c30]">
                Request Return / Refund
              </h3>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="p-1 text-[#737686] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="flex flex-col gap-3">
              <div>
                <label className="font-['Inter'] text-[12px] font-semibold text-[#0b1c30] block mb-1">
                  Reason for Return
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-lg p-2 text-[13px] outline-none"
                >
                  <option value="Damaged item received">Damaged or defective item</option>
                  <option value="Item not as described">Item not matching description</option>
                  <option value="Wrong item delivered">Wrong product / size sent</option>
                  <option value="No longer needed">No longer needed / quality issue</option>
                </select>
              </div>

              <div>
                <label className="font-['Inter'] text-[12px] font-semibold text-[#0b1c30] block mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-lg p-2 text-[13px] outline-none"
                />
              </div>

              <div className="bg-[#eff4ff] p-3 rounded-lg text-[12px] text-[#434655]">
                Refund of <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong> will be credited to {order.paymentMethod} within 2 business days after doorstep pickup.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="flex-1 py-2 border border-[#c3c6d7] rounded-lg font-semibold text-[13px] text-[#434655]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#004ac6] text-white rounded-lg font-semibold text-[13px]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
