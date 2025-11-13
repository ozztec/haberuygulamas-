import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle, Category } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Bana son 3 saatte Türkiye'de olan Gündem, Ekonomi, Spor, Teknoloji ve Dünya kategorilerinde en önemli 20 haber başlığını, kısa özetlerini ve detaylı içeriklerini oluştur. Her haber için 16:9 oranında rastgele bir placeholder resim URL'si de (`https://picsum.photos/640/360?random=NUMBER` formatında, NUMBER yerine rastgele sayı koyarak) ekle. Cevabın sadece JSON formatında olsun.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: {
                    type: Type.STRING,
                    description: "Haberin başlığı.",
                  },
                  summary: {
                    type: Type.STRING,
                    description: "Haberin kısa bir özeti.",
                  },
                  content: {
                    type: Type.STRING,
                    description: "Haberin detaylı içeriği.",
                  },
                  category: {
                    type: Type.STRING,
                    description: "Haberin kategorisi (Gündem, Ekonomi, Spor, Teknoloji, Dünya).",
                    enum: Object.values(Category),
                  },
                  imageUrl: {
                    type: Type.STRING,
                    description: "Haber için bir resim URL'si.",
                  },
                },
                required: ["headline", "summary", "content", "category", "imageUrl"],
              },
            },
          },
          required: ["articles"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    if (!parsedResponse.articles || !Array.isArray(parsedResponse.articles)) {
      throw new Error("API'den geçersiz formatta veri geldi.");
    }

    return parsedResponse.articles.map((article: any, index: number) => ({
      ...article,
      id: `${Date.now()}-${index}`,
      category: article.category as Category,
    }));
  } catch (error) {
    console.error("Haberler alınırken hata oluştu:", error);
    throw new Error("Gemini API'sinden haberler alınamadı. Lütfen daha sonra tekrar deneyin.");
  }
};