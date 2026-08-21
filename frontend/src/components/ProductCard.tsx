import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onBuyNow?: (product: Product, e: React.MouseEvent) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product, e);
    } else {
      onAddToCart(product, e);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, e);
  };

  if (layout === 'list') {
    return (
      <div
        id={`product-card-${product.id}`}
        onClick={() => onSelectProduct(product)}
        className="bg-white border border-[#c3c6d7]/70 rounded-xl p-3 flex gap-3 hover:border-[#004ac6] transition-all hover:shadow-md cursor-pointer relative group"
      >
        {/* Product Image & Badges */}
        <div className="w-24 h-28 sm:w-28 sm:h-28 flex-shrink-0 bg-[#e5eeff] rounded-lg overflow-hidden relative border border-[#c3c6d7]/40">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercent && product.discountPercent > 0 && (
            <div className="absolute top-0 left-0 bg-[#fd761a] text-white font-['Inter'] text-[10px] px-1.5 py-0.5 rounded-br-md font-bold shadow-xs">
              {product.discountPercent}% OFF
            </div>
          )}
          {product.isLimitedStock && (
            <div className="absolute top-0 left-0 bg-[#ba1a1a] text-white font-['Inter'] text-[10px] px-1.5 py-0.5 rounded-br-md font-bold shadow-xs">
              Limited Stock
            </div>
          )}
        </div>

        {/* Product Info & Action Options */}
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-[#004ac6] bg-[#dce9ff] px-1.5 py-0.5 rounded uppercase">
                {product.category}
              </span>
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={(e) => onToggleWishlist(product, e)}
                  className={`p-1 rounded-full transition-colors ${
                    isWishlisted ? 'text-[#ba1a1a]' : 'text-[#737686] hover:text-[#ba1a1a]'
                  }`}
                  aria-label="Wishlist"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isWishlisted ? 'fill' : ''}`}>
                    favorite
                  </span>
                </button>
              )}
            </div>

            <h4 className="font-['Public_Sans'] font-semibold text-[14px] leading-tight text-[#0b1c30] line-clamp-2 mt-1 mb-1 group-hover:text-[#004ac6] transition-colors">
              {product.name}
            </h4>
            <p className="font-['Public_Sans'] text-[11px] text-[#434655] mb-1">
              Sold by: <span className="text-[#0b1c30] font-medium">{product.seller.name}</span>
            </p>
            <div className="flex items-center gap-1.5 text-[11px] mb-1.5">
              <span className="flex items-center text-[#fd761a] font-bold">
                <span className="material-symbols-outlined text-[13px] fill text-[#fd761a] mr-0.5">star</span>
                {product.rating}
              </span>
              <span className="text-[#737686]">({product.ratingCount.toLocaleString()})</span>
            </div>
          </div>

          {/* Pricing & Buy Option Buttons Below Product */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#c3c6d7]/30 flex-wrap gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Public_Sans'] font-extrabold text-[16px] text-[#0b1c30] leading-none">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-['Public_Sans'] text-[11px] text-[#737686] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                id={`add-btn-${product.id}`}
                type="button"
                onClick={handleAddToCartClick}
                className="bg-[#eff4ff] text-[#004ac6] border border-[#b4c5ff] hover:bg-[#dce9ff] rounded-lg px-2.5 py-1.5 flex items-center justify-center transition-colors active:scale-95 text-[11px] font-['Inter'] font-bold cursor-pointer gap-1"
                title="Add to cart"
              >
                <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                Add
              </button>
              <button
                id={`buy-btn-${product.id}`}
                type="button"
                onClick={handleBuyNowClick}
                className="bg-[#fd761a] hover:bg-[#ea580c] text-white rounded-lg px-3 py-1.5 flex items-center justify-center transition-colors active:scale-95 shadow-xs font-['Inter'] text-[11px] font-bold cursor-pointer gap-1"
                title="Buy Now"
              >
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div
      id={`product-grid-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-xl border border-[#c3c6d7]/60 overflow-hidden flex flex-col hover:border-[#004ac6] hover:shadow-md transition-all cursor-pointer group relative"
    >
      {/* Square Image Box */}
      <div className="w-full aspect-square bg-[#eff4ff]/60 relative overflow-hidden flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            id={`wishlist-btn-${product.id}`}
            type="button"
            onClick={(e) => onToggleWishlist(product, e)}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-colors shadow-xs ${
              isWishlisted ? 'text-[#ba1a1a]' : 'text-[#737686] hover:text-[#ba1a1a]'
            }`}
            aria-label="Wishlist product"
          >
            <span className={`material-symbols-outlined text-[18px] ${isWishlisted ? 'fill' : ''}`}>
              favorite
            </span>
          </button>
        )}

        {/* Badges */}
        {product.isBestSeller && (
          <div className="absolute top-2 left-0 bg-[#9d4300] text-white font-['Inter'] text-[10px] font-semibold px-2 py-0.5 rounded-r-md shadow-xs">
            Best Seller
          </div>
        )}
        {product.discountPercent && product.discountPercent > 0 && !product.isBestSeller && (
          <div className="absolute top-2 left-0 bg-[#fd761a] text-white font-['Inter'] text-[10px] font-bold px-2 py-0.5 rounded-r-md shadow-xs">
            {product.discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Card Content & Buy Options Below Product */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-['Public_Sans'] font-medium text-[13px] text-[#0b1c30] line-clamp-2 leading-snug mb-1 group-hover:text-[#004ac6] transition-colors">
            {product.name}
          </h4>
          <div className="flex items-center gap-1 text-[11px] text-[#434655] mb-2">
            <span className="flex items-center text-[#fd761a] font-bold">
              <span className="material-symbols-outlined text-[13px] fill text-[#fd761a] mr-0.5">star</span>
              {product.rating}
            </span>
            <span className="text-[#737686]">({product.ratingCount.toLocaleString()})</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-1">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Public_Sans'] font-extrabold text-[16px] text-[#0b1c30] leading-none">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-['Public_Sans'] text-[11px] text-[#737686] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#007b71] font-semibold">Free Delivery</span>
          </div>

          {/* Buy Option Buttons Directly Below Product */}
          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#c3c6d7]/30">
            <button
              id={`grid-add-btn-${product.id}`}
              type="button"
              onClick={handleAddToCartClick}
              className="py-1.5 px-2 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] border border-[#b4c5ff] text-[11px] font-['Inter'] font-bold transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              title="Add to Cart"
            >
              <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
              Add
            </button>
            <button
              id={`grid-buy-btn-${product.id}`}
              type="button"
              onClick={handleBuyNowClick}
              className="py-1.5 px-2 rounded-lg bg-[#fd761a] hover:bg-[#ea580c] text-white text-[11px] font-['Inter'] font-bold transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              title="Buy Now"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
