// types.ts
export interface Comment {
  id: string;
  comment: string;
  created_at: string;
  username: string;
  user_avatar?: string;
  time_ago: string;
}

export interface Product {
  id: string;
  title: string;
  price: string[];
  description: string;
  category: string[];
  images: string[];
  stock: boolean;
  weight?: string[];
  size?: string[];
  featured: boolean;
  average_rating: number;
  rating_count: number;
  likes_count: number;
  comments_count: number;
  primary_image: string;
  price_display: string;
  comments?: Comment[];
}

export interface UserInteractions {
  has_liked: boolean;
  user_rating: number;
}

export const parseArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    let cleaned = value.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      cleaned = cleaned.slice(1, -1);
    }
    return cleaned ? cleaned.split(',').map(item => item.trim().replace(/"/g, '')) : [];
  }
  return [];
};