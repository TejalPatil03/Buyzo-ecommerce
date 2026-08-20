import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { Product, Category, AppView } from '../types';
import { ProductCard } from './ProductCard';

interface HomeScreenProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onBuyNow?: (product: Product) => void;
  onSelectCategory: (category: Category) => void;
  setCurrentView: (view: AppView) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  setSearchQuery: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onSelectCategory,
  setCurrentView,
  wishlistIds,
  onToggleWishlist,
  setSearchQuery,
}) => {
  // Selected category for in-place exploration (defaults to 'all' or first category)
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');
  const [categoryVisibleLimit, setCategoryVisibleLimit] = useState<number>(8);

  // Trending & Featured products
  const trendingProducts = PRODUCTS.slice(0, 4);
  const mahaDealsProducts = PRODUCTS.filter((p) => p.discountPercent >= 20 || p.isBestSeller);

  // Filter products by selected explore category
  const exploreFilteredProducts = activeCategorySlug === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => {
        if (activeCategorySlug === 'fashion') return p.category === 'Fashion';
        if (activeCategorySlug === 'mobiles') return p.category === 'Mobiles';
        if (activeCategorySlug === 'home') return p.category === 'Home';
        if (activeCategorySlug === 'beauty') return p.category === 'Beauty';
        if (activeCategorySlug === 'grocery') return p.category === 'Grocery';
        if (activeCategorySlug === 'electronics') return p.category === 'Electronics';
        return true;
      });

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === activeCategorySlug);

  return (
    <div id="home-screen" className="pb-24 pt-16 px-3 sm:px-4 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Hero Banner Deals */}
      <section
        id="hero-deal-banner"
        onClick={() => {
          setSearchQuery('Super Deals');
          setCurrentView('search');
        }}
        className="w-full relative rounded-2xl overflow-hidden shadow-sm border border-[#c3c6d7]/30 h-44 sm:h-52 bg-[#dce9ff] flex items-center justify-center cursor-pointer active:scale-[0.99] transition-transform group"
      >
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-85 group-hover:scale-105 transition-transform duration-700"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCljmrtGhk8_rZwoOUX4HmsAyHEaZziDcr44KiYlt9P4NAghoiHscKgV8oxaorND2Qj32y3CYX5F696ikeHZ1Ecuyl_IeH350gLdf4w9vTtQUzW-o6XNOg8g6tkNsWqbXWjb1WU7XoDxbUPp8omVPhaUUDQ0WEYJx3qrXuQS65P6xD4ktm9UBnjqP3XlALTxPGb9VbEf2wL7nGoiUkYeMhV_Vtol6lwDjzZ7tQVMnaX3AhYgYjUEFEaxQ')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004ac6]/90 via-[#004ac6]/65 to-transparent" />
        <div className="relative z-10 w-full p-5 sm:p-7 text-white flex flex-col items-start justify-center h-full">
          <span className="inline-block px-2.5 py-0.5 bg-[#fd761a] text-white font-['Inter'] text-[10px] sm:text-[11px] font-bold rounded uppercase tracking-wider mb-1.5 shadow-xs">
            Maha Bachat Festival
          </span>
          <h2 className="font-['Public_Sans'] text-[20px] sm:text-[26px] md:text-[28px] font-extrabold mb-1 drop-shadow-sm leading-tight">
            Super Deals of the Day
          </h2>
          <p className="font-['Public_Sans'] text-[12px] sm:text-[14px] mb-3 opacity-95">
            Up to 70% Off on Top Electronics, Fashion, Grocery & Home Brands
          </p>
          <button
            id="hero-shop-now-button"
            className="bg-white text-[#004ac6] font-['Inter'] text-[12px] sm:text-[13px] px-4 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-[#eff4ff] active:scale-95 transition-all"
          >
            Explore All Deals
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* AI Assistant Callout Banner */}
      <section
        id="ai-bot-banner"
        onClick={() => setCurrentView('assistant')}
        className="bg-gradient-to-r from-[#d3e4fe] to-[#e5eeff] border border-[#b4c5ff] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-[#004ac6] transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <span className="material-symbols-outlined text-[22px] fill">auto_awesome</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-['Public_Sans'] font-bold text-[13px] sm:text-[14px] text-[#0b1c30]">
                Ask BuyZo AI Assistant
              </h4>
              <span className="bg-[#004ac6] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full tracking-wider">
                Smart Agent
              </span>
            </div>
            <p className="font-['Public_Sans'] text-[11px] sm:text-[12px] text-[#434655]">
              "Compare basmati rice deals", "Best ANC earbuds under ₹2000" or "Festive fashion kurtas"
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#004ac6] text-[20px] flex-shrink-0">chevron_right</span>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 FULLY RESPONSIVE EXPLORE CATEGORIES & RICH PRODUCT SHOWCASE SECTION 🌟 */}
      {/* ========================================================================= */}
      <section id="explore-categories-section" className="bg-white rounded-2xl border border-[#c3c6d7]/60 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        {/* Section Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c3c6d7]/30 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Public_Sans'] font-extrabold text-[18px] sm:text-[20px] text-[#0b1c30]">
                Explore Categories
              </h3>
              <span className="bg-[#eff4ff] text-[#004ac6] border border-[#b4c5ff] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {CATEGORIES.length} Departments
              </span>
            </div>
            <p className="text-[12px] text-[#737686] mt-0.5">
              Browse top verified collections with pan-India delivery & best discounts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="see-all-categories-btn"
              onClick={() => {
                setSearchQuery('');
                setCurrentView('search');
              }}
              className="font-['Inter'] font-bold text-[12px] sm:text-[13px] text-[#004ac6] hover:bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#c3c6d7]/50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Browse All In Search
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Responsive Category Cards / Tabs Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {/* "All" Category Pill */}
          <button
            type="button"
            onClick={() => {
              setActiveCategorySlug('all');
              setCategoryVisibleLimit(8);
            }}
            className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group text-center ${
              activeCategorySlug === 'all'
                ? 'border-[#004ac6] bg-[#eff4ff] ring-2 ring-[#004ac6]/30 shadow-xs'
                : 'border-[#c3c6d7]/60 bg-[#f8f9ff] hover:bg-white hover:border-[#004ac6]'
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">grid_view</span>
            </div>
            <span className="font-['Public_Sans'] font-bold text-[12px] sm:text-[13px] text-[#0b1c30] group-hover:text-[#004ac6] transition-colors leading-tight">
              All Products
            </span>
            <span className="text-[10px] text-[#737686] hidden sm:block font-medium">
              {PRODUCTS.length} Items
            </span>
          </button>

          {/* Individual Category Cards */}
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                id={`category-card-${cat.slug}`}
                type="button"
                onClick={() => {
                  setActiveCategorySlug(cat.slug);
                  setCategoryVisibleLimit(8);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group text-center ${
                  isSelected
                    ? 'border-[#004ac6] bg-[#eff4ff] ring-2 ring-[#004ac6]/30 shadow-xs'
                    : 'border-[#c3c6d7]/60 bg-[#f8f9ff] hover:bg-white hover:border-[#004ac6]'
                }`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e5eeff] overflow-hidden border border-[#c3c6d7]/40 shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-['Public_Sans'] font-bold text-[12px] sm:text-[13px] text-[#0b1c30] group-hover:text-[#004ac6] transition-colors leading-tight truncate w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#737686] hidden sm:block font-medium">
                  {cat.itemCount}+ Items
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Category Information Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
              {activeCategorySlug === 'all' ? 'inventory_2' : 'category'}
            </span>
            <span className="text-[13px] font-bold text-[#0b1c30]">
              Showing {activeCategorySlug === 'all' ? 'All Top Marketplace Items' : `${activeCategoryObj?.name || 'Category'} Collection`}
            </span>
            <span className="text-[11px] bg-[#dce9ff] text-[#004ac6] font-bold px-2 py-0.5 rounded-full">
              {exploreFilteredProducts.length} Products Available
            </span>
          </div>

          <button
            onClick={() => {
              if (activeCategoryObj) {
                onSelectCategory(activeCategoryObj);
              } else {
                setSearchQuery('');
                setCurrentView('search');
              }
            }}
            className="text-[12px] font-bold text-[#004ac6] hover:underline flex items-center gap-1 cursor-pointer self-end sm:self-auto"
          >
            <span>View all in Dedicated Search Page</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>

        {/* Responsive Grid of Category Products */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {exploreFilteredProducts.slice(0, categoryVisibleLimit).map((prod) => (
            <ProductCard
              key={`cat-prod-${prod.id}`}
              product={prod}
              layout="grid"
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isWishlisted={wishlistIds.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Show More Products Button if list exceeds limit */}
        {exploreFilteredProducts.length > categoryVisibleLimit && (
          <div className="flex justify-center pt-2">
            <button
              id="load-more-category-products-btn"
              onClick={() => setCategoryVisibleLimit((prev) => prev + 8)}
              className="py-2.5 px-6 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] font-bold text-[13px] rounded-xl border border-[#b4c5ff] transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
              Show More Products ({exploreFilteredProducts.length - categoryVisibleLimit} remaining)
            </button>
          </div>
        )}
      </section>

      {/* Trending Now Section */}
      <section id="trending-now-section" className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-1.5">
            <h3 className="font-['Public_Sans'] font-extrabold text-[18px] text-[#0b1c30]">
              Trending Now
            </h3>
            <span className="material-symbols-outlined text-[#fd761a] text-[22px] fill">
              local_fire_department
            </span>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setCurrentView('search');
            }}
            className="font-['Inter'] font-bold text-[12px] sm:text-[13px] text-[#004ac6] hover:underline cursor-pointer"
          >
            See All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {trendingProducts.map((prod) => (
            <ProductCard
              key={`trend-${prod.id}`}
              product={prod}
              layout="grid"
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isWishlisted={wishlistIds.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* Featured Deals & Maha Bachat Selection */}
      <section id="featured-deals-section" className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-['Public_Sans'] font-extrabold text-[18px] text-[#0b1c30]">
              Maha Deals & Top Sellers
            </h3>
            <p className="font-['Public_Sans'] text-[12px] text-[#737686]">
              Hand-picked verified products with instant dispatch & maximum savings
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('basmati rice');
              setCurrentView('search');
            }}
            className="font-['Inter'] font-bold text-[12px] sm:text-[13px] text-[#004ac6] hover:underline cursor-pointer"
          >
            Groceries →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {mahaDealsProducts.map((prod) => (
            <ProductCard
              key={`maha-${prod.id}`}
              product={prod}
              layout="grid"
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isWishlisted={wishlistIds.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* Floating AI Assistant Bubble */}
      <button
        id="floating-ai-fab"
        onClick={() => setCurrentView('assistant')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-full shadow-[0px_4px_16px_rgba(37,99,235,0.35)] flex items-center justify-center z-40 active:scale-90 transition-transform cursor-pointer border-2 border-white"
        aria-label="Open AI Shopping Assistant"
      >
        <span className="material-symbols-outlined text-[28px] fill">auto_awesome</span>
      </button>
    </div>
  );
};
