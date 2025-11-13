export enum Category {
  Gundem = 'Gündem',
  Ekonomi = 'Ekonomi',
  Spor = 'Spor',
  Teknoloji = 'Teknoloji',
  Dunya = 'Dünya',
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  content: string; // Detaylı haber içeriği için eklendi
  category: Category;
  imageUrl: string;
}