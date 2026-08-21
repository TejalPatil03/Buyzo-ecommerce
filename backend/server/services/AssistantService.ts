import { GoogleGenAI } from '@google/genai';
import { productRepository } from '../repositories/ProductRepository';
import { ENV } from '../config/env';
import { logger } from '../config/logger';

let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && ENV.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: ENV.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAI;
}

export class AssistantService {
  public async chat(message: string, clientCatalogContext?: any[]): Promise<{
    reply: string;
    recommendedProductIds: string[];
    suggestions: string[];
    grounded: boolean;
  }> {
    const catalog = clientCatalogContext && clientCatalogContext.length > 0
      ? clientCatalogContext
      : (await productRepository.getAllCatalogSnapshot()).map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          rating: p.rating,
          inStock: p.inStock,
          deliveryTime: p.deliveryTimeText,
          description: p.description,
          tags: p.tags,
        }));

    const ai = getGenAI();

    if (!ai) {
      logger.info('Gemini API key not configured, using smart grounded rule engine');
      return this.smartRuleEngine(message, catalog);
    }

    try {
      const systemPrompt = `You are BuyZo Assistant, an intelligent, helpful, and concise shopping advisor on BuyZo, a modern multi-vendor marketplace in India.
Current Available Catalog Snapshot:
${JSON.stringify(catalog, null, 2)}

Instructions:
1. Provide helpful, conversational, and direct recommendations based on the user's inquiry.
2. In your JSON response, identify which products from the catalog best match (return their IDs in recommendedProductIds array).
3. If the user asks for comparison, compare key features, pros, and value.
4. Keep the tone friendly, modern, and concise. Always format prices in INR (₹).
5. Do NOT finalize any purchase directly; always guide them to review the product or add to cart.
6. Return a valid JSON structure with keys: "reply" (string with markdown formatting), "recommendedProductIds" (array of product IDs from catalog), "suggestions" (array of 2-3 quick follow-up prompt chips).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser request: ${message}` }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return {
          reply: parsed.reply || text,
          recommendedProductIds: Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : [],
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Compare prices', 'Check delivery time'],
          grounded: true,
        };
      } catch {
        return {
          reply: text,
          recommendedProductIds: [],
          suggestions: ['Find budget smartphones', 'Best Kurtas for weddings', 'Compare top rated'],
          grounded: true,
        };
      }
    } catch (err: any) {
      logger.warn(`Gemini AI call failed, falling back to smart rule engine: ${err.message}`);
      return this.smartRuleEngine(message, catalog);
    }
  }

  private smartRuleEngine(message: string, catalog: any[]) {
    const q = message.toLowerCase();
    let matches = catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => q.includes(t.toLowerCase())) ||
        p.brand?.toLowerCase().includes(q)
    );

    if (q.includes('earbud') || q.includes('headphone') || q.includes('audio') || q.includes('sound')) {
      matches = catalog.filter((p) => p.category === 'Mobiles' || p.category === 'Electronics');
    } else if (q.includes('dress') || q.includes('kurta') || q.includes('fashion') || q.includes('shirt') || q.includes('saree')) {
      matches = catalog.filter((p) => p.category === 'Fashion');
    } else if (q.includes('phone') || q.includes('mobile') || q.includes('watch')) {
      matches = catalog.filter((p) => p.category === 'Mobiles');
    } else if (q.includes('rice') || q.includes('grocery') || q.includes('food') || q.includes('oil')) {
      matches = catalog.filter((p) => p.category === 'Grocery');
    } else if (q.includes('serum') || q.includes('cream') || q.includes('glow') || q.includes('beauty')) {
      matches = catalog.filter((p) => p.category === 'Beauty');
    }

    const topMatches = matches.slice(0, 3);
    const recommendedIds = topMatches.map((p) => p.id);

    let reply = `Here are some top-rated options on BuyZo that match your request:`;
    if (topMatches.length > 0) {
      reply += `\n\n` + topMatches.map((p) => `* **${p.name}** — ₹${p.price.toLocaleString('en-IN')} (⭐ ${p.rating}/5)`).join('\n');
    } else {
      reply = `I searched our catalog for "${message}". Here are our most popular trending items right now:`;
    }

    return {
      reply,
      recommendedProductIds: recommendedIds.length > 0 ? recommendedIds : ['prod-titan-watch', 'prod-soundcore-earbuds'],
      suggestions: ['Show budget deals under ₹1000', 'Top rated products', 'View latest arrivals'],
      grounded: false,
    };
  }
}

export const assistantService = new AssistantService();
