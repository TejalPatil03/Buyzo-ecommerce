import React, { useState } from 'react';
import { Product, AppView } from '../types';

interface ProductDetailScreenProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  setCurrentView: (view: AppView) => void;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAskAIAboutProduct: (product: Product) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  setCurrentView,
  onBack,
  isWishlisted,
  onToggleWishlist,
  onAskAIAboutProduct,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const images =
    product.additionalImages && product.additionalImages.length > 0
      ? [product.image, ...product.additionalImages.filter((img) => img !== product.image)]
      : [product.image, product.image, product.image, product.image];

  const handleAddToCartWithFeedback = () => {
    onAddToCart(product);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div id="product-detail-screen" className="pt-14 pb-28 bg-[#f8f9ff] min-h-screen px-3 sm:px-4">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#004ac6] text-white px-5 py-2.5 rounded-full shadow-lg text-[13px] font-['Inter'] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Added to cart successfully!
        </div>
      )}

      {/* Main Responsive Container */}
      <div className="max-w-5xl mx-auto my-4 bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c3c6d7]/40">
          {/* Left Column: Media & Gallery (col-span-5) */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col items-center bg-white">
            <div className="relative aspect-square w-full max-w-sm rounded-xl overflow-hidden flex items-center justify-center p-2 bg-[#eff4ff]/50 border border-[#c3c6d7]/30">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[360px] transition-all duration-300 hover:scale-105"
              />

              {/* Wishlist Floating Button */}
              <button
                id="detail-wishlist-button"
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center cursor-pointer transition-transform active:scale-90 ${
                  isWishlisted ? 'text-[#ba1a1a]' : 'text-[#737686] hover:text-[#ba1a1a]'
                }`}
                aria-label="Wishlist"
              >
                <span className={`material-symbols-outlined text-[22px] ${isWishlisted ? 'fill' : ''}`}>
                  favorite
                </span>
              </button>

              {/* Discount / Badge */}
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#fd761a] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector row */}
            <div className="flex justify-center gap-2 mt-4 w-full">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all p-1 bg-[#eff4ff]/40 cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#004ac6] ring-2 ring-[#dce9ff]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Desktop Action Buttons under Media */}
            <div className="hidden lg:flex flex-col gap-2.5 w-full mt-6">
              <button
                onClick={handleAddToCartWithFeedback}
                className="w-full py-3 rounded-xl border-2 border-[#004ac6] text-[#004ac6] font-bold text-[14px] hover:bg-[#eff4ff] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                Add to Cart
              </button>
              <button
                onClick={() => onBuyNow(product)}
                className="w-full py-3 rounded-xl bg-[#fd761a] hover:bg-[#ea580c] text-white font-bold text-[14px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Buy Now
              </button>
            </div>
          </div>

          {/* Right Column: Product Core Info & Details (col-span-7) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col gap-5">
            {/* Header & Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-bold text-[#004ac6] bg-[#dce9ff] px-2 py-0.5 rounded uppercase">
                  {product.category}
                </span>
                {product.isBestSeller && (
                  <span className="text-[11px] font-semibold text-[#9d4300] bg-[#ffedd5] px-2 py-0.5 rounded">
                    Best Seller
                  </span>
                )}
              </div>
              <h1 className="font-['Public_Sans'] font-extrabold text-[20px] sm:text-[24px] leading-snug text-[#0b1c30]">
                {product.name}
              </h1>

              {/* Ratings Bar */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#fd761a]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-[18px] fill text-[#fd761a]"
                    >
                      {star <= Math.floor(product.rating)
                        ? 'star'
                        : star - product.rating < 1
                        ? 'star_half'
                        : 'star'}
                    </span>
                  ))}
                </div>
                <span className="font-bold text-[13px] text-[#0b1c30]">{product.rating}</span>
                <span className="text-[12px] text-[#737686]">
                  ({product.ratingCount.toLocaleString()} verified ratings)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#c3c6d7]/50 flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2.5">
                <span className="font-['Public_Sans'] font-extrabold text-[26px] sm:text-[28px] text-[#0b1c30]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="font-['Public_Sans'] text-[15px] text-[#737686] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="text-[12px] font-bold text-[#007b71] bg-[#89f5e7]/60 px-2 py-0.5 rounded">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#737686]">Inclusive of all taxes & free delivery eligible</span>
            </div>

            {/* Delivery & Seller Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[#c3c6d7]/40 bg-[#eff4ff]/40 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#004ac6] text-[22px] mt-0.5">
                  local_shipping
                </span>
                <div>
                  <span className="font-bold text-[13px] text-[#0b1c30] block">
                    {product.deliveryTimeText}
                  </span>
                  <span className="text-[11px] text-[#737686]">
                    BuyZo Express Doorstep Delivery with OTP
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#c3c6d7]/40 bg-[#eff4ff]/40 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#007b71] text-[22px] mt-0.5">
                  verified
                </span>
                <div>
                  <span className="font-bold text-[13px] text-[#0b1c30] block">
                    Sold by {product.seller.name}
                  </span>
                  <span className="text-[11px] text-[#737686]">
                    {product.seller.rating} ★ Rating • {product.seller.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Inline Buy Now & Add to Cart Action Area */}
            <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#b4c5ff]/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#007b71]">
                  <span className="material-symbols-outlined text-[16px] fill">verified_user</span>
                  100% Genuine • Easy 7-Day Return • Safe Checkout
                </div>
                <span className="text-[11px] font-semibold text-[#004ac6] bg-[#dce9ff] px-2 py-0.5 rounded">
                  In Stock ({product.stockCount} units)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="detail-inline-add-to-cart-btn"
                  onClick={handleAddToCartWithFeedback}
                  className="py-3 px-4 rounded-xl border-2 border-[#004ac6] text-[#004ac6] font-bold text-[14px] hover:bg-white transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 bg-white shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  Add to Cart
                </button>
                <button
                  id="detail-inline-buy-now-btn"
                  onClick={() => onBuyNow(product)}
                  className="py-3 px-4 rounded-xl bg-[#fd761a] hover:bg-[#ea580c] text-white font-bold text-[14px] shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  Buy Now
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#c3c6d7]/40 pt-4">
              <h2 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30] mb-2">
                About this Item
              </h2>
              <p
                className={`font-['Public_Sans'] text-[13px] sm:text-[14px] text-[#434655] leading-relaxed ${
                  !isDescExpanded ? 'line-clamp-3' : ''
                }`}
              >
                {product.description}
              </p>
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-[#004ac6] font-bold text-[12px] mt-1.5 flex items-center gap-1 cursor-pointer hover:underline"
              >
                {isDescExpanded ? 'Read Less' : 'Read Full Description'}
                <span className={`material-symbols-outlined text-[16px] transition-transform ${isDescExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
            </div>

            {/* Specifications */}
            <div className="border-t border-[#c3c6d7]/40 pt-4">
              <h2 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30] mb-2">
                Product Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                {Object.entries(product.specifications)
                  .slice(0, showAllSpecs ? undefined : 6)
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2 rounded-lg bg-[#f8f9ff] border border-[#c3c6d7]/30 flex justify-between"
                    >
                      <span className="text-[#737686]">{key}</span>
                      <span className="font-semibold text-[#0b1c30] text-right">{val}</span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => setShowAllSpecs(!showAllSpecs)}
                className="text-[#004ac6] font-bold text-[12px] mt-2 cursor-pointer hover:underline"
              >
                {showAllSpecs ? 'Show Key Specs Only' : 'View All Technical Specifications →'}
              </button>
            </div>

            {/* Customer Reviews Section */}
            <div className="border-t border-[#c3c6d7]/40 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30]">
                  Customer Reviews ({product.reviews.length})
                </h2>
              </div>

              <div className="flex flex-col gap-2.5">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl border border-[#c3c6d7]/40 bg-[#f8f9ff] text-[12px]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-[10px]">
                          {rev.avatarLetter || rev.author.charAt(0)}
                        </div>
                        <span className="font-bold text-[#0b1c30]">{rev.author}</span>
                        {rev.isVerifiedBuyer && (
                          <span className="text-[10px] text-[#007b71] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] fill">verified</span>
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex text-[#fd761a]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-[13px] ${
                              s <= rev.rating ? 'fill text-[#fd761a]' : 'text-[#c3c6d7]'
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[#434655] leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-[#737686] block mt-1">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Action Button ("Ask BuyZo Assistant about this product") */}
      <button
        id="detail-ask-ai-fab"
        onClick={() => onAskAIAboutProduct(product)}
        className="fixed bottom-[88px] md:bottom-6 right-4 w-14 h-14 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-full shadow-xl flex items-center justify-center transition-all z-40 active:scale-95 cursor-pointer border-2 border-white"
        aria-label="Ask BuyZo AI Assistant about this product"
      >
        <span className="material-symbols-outlined text-[28px] fill">auto_awesome</span>
      </button>

      {/* Mobile Floating Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#c3c6d7] p-3 flex gap-3 z-50 shadow-[0px_-4px_12px_rgba(37,99,235,0.08)] max-w-2xl mx-auto">
        <button
          id="detail-add-to-cart-btn-mobile"
          onClick={handleAddToCartWithFeedback}
          className="flex-1 py-2.5 rounded-xl border-2 border-[#004ac6] text-[#004ac6] font-['Inter'] text-[13px] font-bold text-center hover:bg-[#eff4ff] transition-colors active:scale-[0.98] cursor-pointer"
        >
          Add to Cart
        </button>
        <button
          id="detail-buy-now-btn-mobile"
          onClick={() => onBuyNow(product)}
          className="flex-1 py-2.5 rounded-xl bg-[#fd761a] text-white font-['Inter'] text-[13px] font-bold text-center hover:bg-[#ea580c] transition-colors active:scale-[0.98] shadow-md cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
