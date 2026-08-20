import React, { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from '../data/mockData';
import { Product, ChatMessage, AppView } from '../types';

interface AIAssistantScreenProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onBuyNow?: (product: Product) => void;
  setCurrentView: (view: AppView) => void;
  initialPrompt?: string;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  setCurrentView,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hi! I'm your BuyZo Assistant. What are you looking for today?",
      timestamp: 'Just now',
      suggestions: [
        'Find budget smartphones',
        'Best Kurtas for weddings',
        'Compare basmati rice deals',
        'Show earbuds under ₹2000 with ANC',
      ],
    },
    {
      id: 'msg-user-1',
      sender: 'user',
      text: 'Show me some good wireless earbuds under ₹2000 with active noise cancellation.',
      timestamp: 'Just now',
    },
    {
      id: 'msg-assistant-1',
      sender: 'assistant',
      text: 'Here are top-rated wireless earbuds under ₹2000 featuring ANC, perfect for your needs:',
      timestamp: 'Just now',
      recommendedProducts: [
        PRODUCTS.find((p) => p.id === 'prod-soundcore-earbuds') || PRODUCTS[6],
        PRODUCTS.find((p) => p.id === 'prod-noise-buds-anc') || PRODUCTS[7],
      ],
      suggestions: ['Tell me more about SoundCore', 'Compare these two', 'Show wireless headphones under ₹5000'],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Intelligent Grounded Chat Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsgId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: text,
        timestamp: 'Just now',
      },
    ];
    setMessages(newMessages);
    setInputVal('');
    setIsLoading(true);

    try {
      // Call server-side API with Gemini AI
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          catalogContext: PRODUCTS.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            brand: p.brand,
            category: p.category,
            rating: p.rating,
            tags: p.tags,
            description: p.description,
          })),
        }),
      });

      const data = await res.json();

      let replyText = '';
      let matchedProducts: Product[] = [];
      let nextSuggestions: string[] = [];

      if (data && data.success && data.reply) {
        replyText = data.reply;
        if (data.recommendedProductIds && Array.isArray(data.recommendedProductIds)) {
          matchedProducts = PRODUCTS.filter((p) => data.recommendedProductIds.includes(p.id));
        }
        if (data.suggestions && Array.isArray(data.suggestions)) {
          nextSuggestions = data.suggestions;
        }
      } else {
        // Smart Grounded Fallback based on catalog keywords
        const lower = text.toLowerCase();
        if (lower.includes('earbud') || lower.includes('anc') || lower.includes('audio') || lower.includes('headphone')) {
          replyText = "Here are our top recommended audio picks with noise cancellation and high battery life:";
          matchedProducts = PRODUCTS.filter((p) => p.category === 'Electronics' || p.tags.includes('earbuds') || p.tags.includes('headphones'));
          nextSuggestions = ['Compare SoundCore vs Noise', 'Best headphones under ₹30,000', 'Add to Cart'];
        } else if (lower.includes('kurta') || lower.includes('wedding') || lower.includes('ethnic') || lower.includes('fashion')) {
          replyText = "For wedding & festive occasions, this Manyavar Cotton Blend Kurta Set in Indigo Blue is our #1 Best Seller with over 5,000 verified ratings:";
          matchedProducts = PRODUCTS.filter((p) => p.category === 'Fashion');
          nextSuggestions = ['Check size guide', 'View fabric details', 'Show more ethnic wear'];
        } else if (lower.includes('rice') || lower.includes('basmati') || lower.includes('grocery')) {
          replyText = "Here are our best-selling basmati rice packs from Kohinoor, India Gate, and Daawat. Kohinoor is currently 15% OFF:";
          matchedProducts = PRODUCTS.filter((p) => p.category === 'Grocery');
          nextSuggestions = ['Show 10kg pack deals', 'Check express delivery', 'View customer reviews'];
        } else if (lower.includes('watch') || lower.includes('fitness') || lower.includes('smartwatch')) {
          replyText = "The Titan Smart Pro Fitness Watch with vibrant AMOLED display and 14-day battery is currently 37% off:";
          matchedProducts = PRODUCTS.filter((p) => p.id === 'prod-titan-watch');
          nextSuggestions = ['Check water resistance', 'Show battery life', 'Compare with other watches'];
        } else {
          replyText = `I found these top trending products on BuyZo for "${text}":`;
          matchedProducts = PRODUCTS.slice(0, 3);
          nextSuggestions = ['Find budget smartphones', 'Best Kurtas for weddings', 'Show basmati rice 5kg'];
        }
      }

      // If no matched products yet, provide matching search items
      if (matchedProducts.length === 0) {
        const words = text.toLowerCase().split(' ');
        matchedProducts = PRODUCTS.filter((p) =>
          words.some((w) => p.name.toLowerCase().includes(w) || p.tags.some((t) => t.includes(w)))
        );
        if (matchedProducts.length === 0) {
          matchedProducts = PRODUCTS.slice(0, 2);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: 'Just now',
          recommendedProducts: matchedProducts.length > 0 ? matchedProducts : undefined,
          suggestions: nextSuggestions.length > 0 ? nextSuggestions : ['Show best deals', 'Browse all categories'],
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: "Here are top matching products from BuyZo catalog for your request:",
          timestamp: 'Just now',
          recommendedProducts: PRODUCTS.slice(0, 2),
          suggestions: ['Find budget smartphones', 'Best Kurtas for weddings'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSimulate = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputVal('Show me best basmati rice deals for family');
    }, 1800);
  };

  return (
    <div id="ai-assistant-screen" className="pt-14 pb-32 px-4 max-w-3xl mx-auto flex flex-col min-h-screen">
      {/* Date Divider */}
      <div className="flex justify-center my-3">
        <span className="bg-[#eff4ff] text-[#434655] font-['Inter'] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#c3c6d7]/40">
          Today
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex flex-col gap-4 flex-1">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex flex-col self-end max-w-[85%] sm:max-w-[75%]">
                <div className="bg-[#004ac6] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-xs">
                  <p className="font-['Public_Sans'] text-[14px] leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          }

          // Assistant Message (matching Image 7)
          return (
            <div key={msg.id} className="flex flex-col self-start max-w-full sm:max-w-[90%] w-full">
              <div className="bg-[#dce9ff] text-[#0b1c30] p-4 rounded-2xl rounded-tl-xs shadow-xs relative border border-[#b4c5ff]/50">
                {/* Floating Sparkle Avatar */}
                <div className="absolute -top-3 -left-2 bg-[#004ac6] text-white rounded-full p-1 shadow-sm flex items-center justify-center h-8 w-8">
                  <span className="material-symbols-outlined fill text-[18px]">auto_awesome</span>
                </div>

                <p className="font-['Public_Sans'] text-[14px] ml-4 mt-0.5 mb-3 leading-relaxed">
                  {msg.text}
                </p>

                {/* Embedded Products Carousel (Exact Image 7 style) */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x ml-4 -mr-2 pr-2 hide-scrollbar">
                    {msg.recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => onSelectProduct(prod)}
                        className="snap-start shrink-0 w-44 bg-white rounded-xl border border-[#c3c6d7] overflow-hidden flex flex-col cursor-pointer hover:border-[#004ac6] hover:shadow-md transition-all group"
                      >
                        <div className="aspect-square w-full bg-[#eff4ff] relative overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {prod.discountPercent && (
                            <span className="absolute top-1 left-1 bg-[#fd761a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              {prod.discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                          <h4 className="font-['Public_Sans'] font-semibold text-[12px] text-[#0b1c30] line-clamp-2 leading-tight group-hover:text-[#004ac6]">
                            {prod.name}
                          </h4>

                          <div className="mt-auto flex flex-col gap-1.5 pt-1">
                            <span className="font-['Public_Sans'] font-bold text-[14px] text-[#0b1c30]">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            <div className="grid grid-cols-2 gap-1 w-full pt-1 border-t border-[#c3c6d7]/30">
                              <button
                                id={`ai-add-btn-${prod.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart(prod, e);
                                }}
                                className="bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] border border-[#b4c5ff] text-[10px] font-bold py-1 px-1.5 rounded flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                                title="Add to cart"
                              >
                                <span className="material-symbols-outlined text-[13px]">add</span>
                                Add
                              </button>
                              <button
                                id={`ai-buy-btn-${prod.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onBuyNow) {
                                    onBuyNow(prod);
                                  } else {
                                    onAddToCart(prod, e);
                                  }
                                }}
                                className="bg-[#fd761a] hover:bg-[#ea580c] text-white text-[10px] font-bold py-1 px-1.5 rounded flex items-center justify-center gap-0.5 shadow-xs transition-colors cursor-pointer"
                                title="Buy Now"
                              >
                                <span className="material-symbols-outlined text-[13px]">bolt</span>
                                Buy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Browse Catalog Link */}
                <div className="ml-4 mt-3 flex items-center gap-2">
                  <span className="font-['Public_Sans'] text-[12px] text-[#434655]">
                    Not quite what you need?
                  </span>
                  <button
                    onClick={() => setCurrentView('search')}
                    className="font-['Inter'] text-[12px] font-bold text-[#004ac6] hover:underline flex items-center cursor-pointer"
                  >
                    Browse Catalog
                    <span className="material-symbols-outlined text-[15px] ml-0.5">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* Suggested Prompts Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 ml-4">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="bg-white text-[#004ac6] border border-[#004ac6]/30 font-['Inter'] text-[12px] font-medium px-3.5 py-1.5 rounded-full hover:bg-[#eff4ff] hover:border-[#004ac6] transition-all shadow-xs cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Loading Indicator */}
        {isLoading && (
          <div className="flex self-start ml-4 bg-[#dce9ff] p-3 rounded-2xl rounded-tl-xs items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#004ac6] animate-spin">
              progress_activity
            </span>
            <span className="font-['Public_Sans'] text-[12px] text-[#004ac6] font-medium">
              BuyZo Assistant is researching products...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Chat Input Area (matching Image 7) */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 bg-[#f8f9ff]/95 backdrop-blur-md border-t border-[#c3c6d7]/40 px-4 py-3 z-40">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <input
              id="ai-assistant-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask BuyZo Assistant (e.g. compare wireless earbuds)..."
              className="w-full bg-white rounded-lg border border-[#c3c6d7] py-3 pl-4 pr-12 font-['Public_Sans'] text-[14px] text-[#0b1c30] placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={handleVoiceSimulate}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors cursor-pointer ${
                isListening ? 'bg-[#fd761a] text-white animate-pulse' : 'text-[#004ac6] hover:bg-[#eff4ff]'
              }`}
              title="Voice Search"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isListening ? 'graphic_eq' : 'mic'}
              </span>
            </button>
          </div>

          <button
            id="ai-send-message-btn"
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() || isLoading}
            className="bg-[#004ac6] text-white rounded-lg h-12 w-12 flex items-center justify-center shadow-xs hover:bg-[#2563eb] disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
            aria-label="Send Message"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
