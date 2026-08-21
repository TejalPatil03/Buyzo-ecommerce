import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/mockData';
import { Product, AppView } from '../types';
import { ProductCard } from './ProductCard';

interface SearchResultsScreenProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onBuyNow?: (product: Product) => void;
  setCurrentView: (view: AppView) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  setCurrentView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Extract all distinct brands for filter
  const allBrands = useMemo(() => {
    const brands = new Set(PRODUCTS.map((p) => p.brand));
    return ['all', ...Array.from(brands)];
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Price range filter
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === 'price_low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [searchQuery, selectedBrand, minRating, priceRange, sortBy]);

  const activeFilterCount = (selectedBrand !== 'all' ? 1 : 0) + (minRating > 0 ? 1 : 0) + (priceRange[1] < 50000 ? 1 : 0);

  const displayQuery = searchQuery.trim() || 'premium basmati rice 5kg';

  return (
    <div id="search-results-screen" className="pt-16 pb-24 px-4 max-w-3xl mx-auto flex flex-col gap-5 w-full">
      {/* Filter & Sort Chips Scroll (Exact Image 1 style) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 items-center">
        {/* Filters Toggle Button */}
        <button
          id="filter-modal-toggle-btn"
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex-shrink-0 flex items-center gap-1 border rounded-full px-4 py-2 font-['Inter'] text-[12px] font-semibold transition-colors cursor-pointer ${
            activeFilterCount > 0
              ? 'bg-[#004ac6] text-white border-[#004ac6]'
              : 'bg-[#eff4ff] border-[#c3c6d7] text-[#0b1c30] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </button>

        {/* Sort: Relevance dropdown button */}
        <div className="relative flex-shrink-0">
          <button
            id="sort-dropdown-btn"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 bg-[#2563eb] text-white rounded-full px-4 py-2 font-['Inter'] text-[12px] font-semibold shadow-xs cursor-pointer"
          >
            Sort: {sortBy === 'relevance' ? 'Relevance' : sortBy === 'price_low' ? 'Price: Low to High' : sortBy === 'price_high' ? 'Price: High to Low' : 'Rating'}
            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
          </button>

          {showSortDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#c3c6d7] rounded-xl shadow-lg z-30 py-1 w-48 font-['Inter'] text-[13px]">
              <button
                onClick={() => {
                  setSortBy('relevance');
                  setShowSortDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-[#eff4ff] ${sortBy === 'relevance' ? 'text-[#004ac6] font-bold bg-[#eff4ff]' : ''}`}
              >
                Relevance
              </button>
              <button
                onClick={() => {
                  setSortBy('price_low');
                  setShowSortDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-[#eff4ff] ${sortBy === 'price_low' ? 'text-[#004ac6] font-bold bg-[#eff4ff]' : ''}`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => {
                  setSortBy('price_high');
                  setShowSortDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-[#eff4ff] ${sortBy === 'price_high' ? 'text-[#004ac6] font-bold bg-[#eff4ff]' : ''}`}
              >
                Price: High to Low
              </button>
              <button
                onClick={() => {
                  setSortBy('rating');
                  setShowSortDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-[#eff4ff] ${sortBy === 'rating' ? 'text-[#004ac6] font-bold bg-[#eff4ff]' : ''}`}
              >
                Customer Rating
              </button>
            </div>
          )}
        </div>

        {/* Rating 4.0+ Chip */}
        <button
          id="rating-filter-chip"
          onClick={() => setMinRating(minRating === 4.0 ? 0 : 4.0)}
          className={`flex-shrink-0 flex items-center gap-1 border rounded-full px-4 py-2 font-['Inter'] text-[12px] font-semibold transition-colors cursor-pointer ${
            minRating === 4.0
              ? 'bg-[#004ac6] text-white border-[#004ac6]'
              : 'bg-[#e5eeff] border-[#c3c6d7] text-[#0b1c30] hover:bg-[#d3e4fe]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px] fill text-[#fd761a]">star</span>
          Rating 4.0+
        </button>

        {/* Brand Chip */}
        <button
          id="brand-filter-chip"
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex-shrink-0 flex items-center gap-1 border rounded-full px-4 py-2 font-['Inter'] text-[12px] font-semibold transition-colors cursor-pointer ${
            selectedBrand !== 'all'
              ? 'bg-[#004ac6] text-white border-[#004ac6]'
              : 'bg-[#e5eeff] border-[#c3c6d7] text-[#0b1c30] hover:bg-[#d3e4fe]'
          }`}
        >
          Brand: {selectedBrand === 'all' ? 'All' : selectedBrand}
          <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
        </button>
      </div>

      {/* AI Suggestion Banner (Exact Image 1 style) */}
      <div
        id="ai-suggestion-banner"
        className="bg-[#d3e4fe] border border-[#b4c5ff] rounded-xl p-4 flex gap-3 items-start shadow-xs relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#dbe1ff] rounded-full blur-xl opacity-60 pointer-events-none" />
        <div className="bg-[#004ac6] text-white p-2 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[20px] fill">auto_awesome</span>
        </div>
        <div className="relative z-10">
          <h3 className="font-['Public_Sans'] font-bold text-[15px] text-[#0b1c30] mb-1 flex items-center gap-2">
            BuyZo Bot Suggests{' '}
            <span className="bg-[#2563eb] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Smart Pick
            </span>
          </h3>
          <p className="font-['Public_Sans'] text-[12px] text-[#434655] mb-2 leading-relaxed">
            Based on your previous orders, you might prefer the 10kg pack from 'India Gate' for better value.
          </p>
          <button
            id="view-ai-recommendation-btn"
            onClick={() => {
              const indiaGate = PRODUCTS.find((p) => p.id === 'prod-india-gate-5kg');
              if (indiaGate) onSelectProduct(indiaGate);
            }}
            className="font-['Inter'] text-[12px] font-bold text-[#004ac6] flex items-center gap-1 hover:underline cursor-pointer"
          >
            View Recommendation
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Search Results Count */}
      <div className="font-['Public_Sans'] text-[12px] text-[#434655] flex justify-between items-center">
        <span>
          Showing 1-{filteredProducts.length} of {filteredProducts.length > 0 ? 145 : 0} results for{' '}
          <span className="font-bold text-[#0b1c30]">"{displayQuery}"</span>
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setSelectedBrand('all');
              setMinRating(0);
              setPriceRange([0, 50000]);
              setSortBy('relevance');
            }}
            className="text-[#004ac6] font-semibold text-[11px] hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Product List / Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              layout="list"
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isWishlisted={wishlistIds.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center border border-[#c3c6d7]/60 flex flex-col items-center">
          <span className="material-symbols-outlined text-[48px] text-[#737686] mb-2">search_off</span>
          <h3 className="font-['Public_Sans'] font-bold text-[16px] text-[#0b1c30] mb-1">
            No products found matching "{searchQuery}"
          </h3>
          <p className="font-['Public_Sans'] text-[13px] text-[#434655] mb-4 max-w-sm">
            Try searching for "basmati rice", "earbuds", "sony headphones", or explore our categories.
          </p>
          <button
            onClick={() => setSearchQuery('premium basmati rice 5kg')}
            className="bg-[#004ac6] text-white px-4 py-2 rounded-full font-['Inter'] text-[12px] font-semibold cursor-pointer"
          >
            Reset Search
          </button>
        </div>
      )}

      {/* Load More Indicator (matching Image 1) */}
      <div className="py-4 flex flex-col items-center justify-center w-full gap-2">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#004ac6] border-t-transparent" />
        <span className="font-['Public_Sans'] text-[11px] text-[#737686]">
          Loading more verified sellers...
        </span>
      </div>

      {/* Filter Modal Dialog */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#c3c6d7]/50 pb-3">
              <h3 className="font-['Public_Sans'] font-bold text-[18px] text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#004ac6]">tune</span>
                Filter Products
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 text-[#737686] hover:text-[#0b1c30] rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="font-['Inter'] font-semibold text-[13px] text-[#0b1c30] mb-2 block">
                Brand
              </label>
              <div className="flex flex-wrap gap-2">
                {allBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border capitalize transition-colors ${
                      selectedBrand === b
                        ? 'bg-[#004ac6] text-white border-[#004ac6]'
                        : 'bg-[#eff4ff] border-[#c3c6d7] text-[#0b1c30] hover:bg-[#d3e4fe]'
                    }`}
                  >
                    {b === 'all' ? 'All Brands' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="font-['Inter'] font-semibold text-[13px] text-[#0b1c30] mb-2 block">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(rate)}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold border flex items-center justify-center gap-1 transition-colors ${
                      minRating === rate
                        ? 'bg-[#004ac6] text-white border-[#004ac6]'
                        : 'bg-[#eff4ff] border-[#c3c6d7] text-[#0b1c30] hover:bg-[#d3e4fe]'
                    }`}
                  >
                    {rate === 0 ? (
                      'Any'
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px] fill text-[#fd761a]">star</span>
                        {rate}+
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-['Inter'] font-semibold text-[13px] text-[#0b1c30]">
                  Max Price
                </label>
                <span className="font-['Public_Sans'] font-bold text-[13px] text-[#004ac6]">
                  Up to ₹{priceRange[1].toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-[#004ac6]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3 border-t border-[#c3c6d7]/50 mt-2">
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setMinRating(0);
                  setPriceRange([0, 50000]);
                }}
                className="flex-1 py-2.5 rounded-lg border border-[#c3c6d7] text-[#434655] font-['Inter'] text-[13px] font-semibold hover:bg-[#eff4ff]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#004ac6] text-white font-['Inter'] text-[13px] font-semibold hover:bg-[#2563eb]"
              >
                Apply ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
