"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Package, Heart, MessageCircle } from "lucide-react";
import { Product, parseArray } from "@/lib/types";

interface ProductInfoProps {
  product: Product;
  userRating: number;
  hasLiked: boolean;
  isAuthenticated: boolean;
  onRating: (rating: number) => void;
  onLike: () => void;
  onAddToCart: () => void;
  onShowComments: () => void;
  isAddingToCart: boolean;
}

const ProductInfo = ({ 
  product, 
  userRating, 
  hasLiked, 
  isAuthenticated, 
  onRating, 
  onLike, 
  onAddToCart, 
  onShowComments,
  isAddingToCart 
}: ProductInfoProps) => {
  const prices = parseArray(product.price);
  const categories = parseArray(product.category);
  const weights = parseArray(product.weight);
  const sizes = parseArray(product.size);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-blue-600">
            {product.price_display || `$${prices[0] || '0.00'}`}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 cursor-pointer transition-colors ${
                    i < userRating
                      ? "fill-blue-400 text-blue-400" // User's rating
                      : i < Math.floor(product.average_rating)
                      ? "fill-yellow-400 text-yellow-400" // Average rating
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                  onClick={() => isAuthenticated && onRating(i + 1)}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.average_rating.toFixed(1)}) {product.rating_count} puan
            </span>
          </div>
        </div>

        {/* Social Actions */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLike}
            disabled={!isAuthenticated}
            className={hasLiked ? "text-red-500 border-red-500" : ""}
          >
            <Heart className={`w-4 h-4 mr-1 ${hasLiked ? "fill-current" : ""}`} />
            {product.likes_count} Beğeni
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onShowComments}
            disabled={!isAuthenticated}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            {product.comments_count} Yorum
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mb-4">
            Lütfen bu ürünü beğenmek, puanlamak veya yorum yapmak için giriş yapın.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Package className="w-4 h-4" />
        <span className={`font-medium ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock ? 'Stokta Mevcut' : 'Stokta Yok'}
        </span>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Kategoriler:</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, i) => (
              <Badge key={i} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Specifications */}
      {(weights.length > 0 || sizes.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Özellikler</h3>
          {weights.length > 0 && (
            <div>
              <span className="font-medium">Ağırlık Seçenekleri: </span>
              <span className="text-gray-600">{weights.join(', ')}</span>
            </div>
          )}
          {sizes.length > 0 && (
            <div>
              <span className="font-medium">Boyut Seçenekleri: </span>
              <span className="text-gray-600">{sizes.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Açıklama</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={onAddToCart}
        disabled={isAddingToCart || !product.stock}
        className="w-full"
        size="lg"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {isAddingToCart ? "Sepete Ekleniyor..." : !product.stock ? "Stokta mevcut değil." : "Sepete Ekle"}
      </Button>
    </div>
  );
};

export default ProductInfo;