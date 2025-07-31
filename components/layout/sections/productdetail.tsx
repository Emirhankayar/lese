"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/sbClient";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, ShoppingCart, Package, Heart, MessageCircle, User, Send } from "lucide-react";

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  username: string;
  user_avatar?: string;
  time_ago: string;
}

interface Product {
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

const parseArray = (value: any): string[] => {
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

const ProductDetailSection = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  
  // Comment input states
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  // Image zoom states
  const zoomRef = useRef<HTMLDivElement>(null);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const openFullscreen = () => setIsFullscreenOpen(true);
  const closeFullscreen = () => setIsFullscreenOpen(false);

  // Function to refresh product data and user interactions
  const refreshProductData = async () => {
    if (!productId) return;

    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.rpc('get_product_with_details', {
        product_uuid: productId,
        user_uuid: user?.id || null,
        comments_limit: 10
      });

      if (!error && data) {
        setProduct(data.product);
        setComments(data.comments || []);
        
        // Update user interactions
        if (data.user_interactions && user) {
          setHasLiked(data.user_interactions.has_liked);
          setUserRating(data.user_interactions.user_rating || 0);
        }
      }
    } catch (err) {
      console.error("Error refreshing product data:", err);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const supabase = createClient();
      setLoading(true);
      setError(null);

      try {
        
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        
        const { data, error } = await supabase.rpc('get_product_with_details', {
          product_uuid: productId,
          user_uuid: user?.id || null,
          comments_limit: 10
        });

        if (error) {
          console.error('Error fetching product:', error);
          setError("Product not found");
        } else {
          setProduct(data.product);
          setComments(data.comments || []);
          
          if (data.user_interactions && user) {
            setHasLiked(data.user_interactions.has_liked);
            setUserRating(data.user_interactions.user_rating || 0);
          } else {
            setHasLiked(false);
            setUserRating(0);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("An error occurred while loading the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      const supabase = createClient();
      
      
      const { data, error } = await supabase.rpc('create_order', {
        product_uuid: product.id,
        quantity_val: 1,
        selected_price_val: parseArray(product.price)[0],
      });

      if (error) {
        console.error('Order creation error:', error);
        alert(`Failed to add to cart: ${error.message}`);
      } else if (data?.success) {
        alert("Item added to cart!");
        
        await refreshProductData();
      } else {
        alert(`Failed to add to cart: ${data?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLike = async () => {
    if (!product || !isAuthenticated) return;

    const supabase = createClient();
    
    try {
      console.log('Attempting to like product:', product.id);
      
      const { data, error } = await supabase.rpc('toggle_product_like', {
        product_uuid: product.id
      });

      console.log('Like response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error liking product: ${error.message}`);
        return;
      }

      if (data?.success) {
  
        setHasLiked(data.liked);
        setProduct(prev => prev ? {
          ...prev,
          likes_count: data.like_count
        } : null);
        
        await refreshProductData();
      } else {
        console.error('Function returned error:', data?.error);
        alert(`Error: ${data?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Unexpected error toggling like:", err);
      alert("An unexpected error occurred");
    }
  };

  const handleRating = async (rating: number) => {
    if (!product || !isAuthenticated) return;

    const supabase = createClient();
    
    try {
      console.log('Attempting to rate product:', product.id, 'with rating:', rating);
      
      const { data, error } = await supabase.rpc('set_product_rating', {
        product_uuid: product.id,
        rating_value: rating
      });

      console.log('Rating response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error rating product: ${error.message}`);
        return;
      }

      if (data?.success) {
        setUserRating(rating);
        setProduct(prev => prev ? {
          ...prev,
          average_rating: data.avg_rating,
          rating_count: data.rating_count
        } : null);
        
        
        await refreshProductData();
      } else {
        console.error('Function returned error:', data?.error);
        alert(`Error: ${data?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Unexpected error setting rating:", err);
      alert("An unexpected error occurred");
    }
  };

  const handleAddComment = async () => {
    if (!product || !newComment.trim() || !isAuthenticated) return;

    setIsAddingComment(true);
    const supabase = createClient();
    
    try {
      console.log('Ürüne yorum ekleniyor:', product.id);
      
      const { data, error } = await supabase.rpc('add_product_comment', {
        product_uuid: product.id,
        comment_text: newComment.trim()
      });

      console.log('Comment response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        alert(`Yorum eklenirken hata oluştu: ${error.message}`);
        return;
      }

      if (data?.success) {

        setNewComment("");
        setShowCommentInput(false);
        
        
        await refreshProductData();

        alert('Yorum başarıyla eklendi!');
      } else {
        console.error('Function returned error:', data?.error);
        alert(`Error: ${data?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Unexpected error adding comment:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 mb:py-32 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 mb:py-32 max-w-6xl">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error || "Product not found"}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  const prices = parseArray(product.price);
  const categories = parseArray(product.category);
  
  const weights = parseArray(product.weight);
  const sizes = parseArray(product.size);


  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoomRef.current) return;

    const rect = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
    setZoomActive(true);
  };

  const handleMouseLeave = () => {
    setZoomActive(false);
  };
  // Better image handling in your component
  const images = parseArray(product.images).filter(img => img && img.trim() !== '');
  const currentImage = (images.length > 0 && images[selectedImageIndex]) 
    ? images[selectedImageIndex] 
    : product.primary_image || 'https://zelzrvosxgydwzufatbt.supabase.co/storage/v1/object/public/placeholders/placeholder-product.jpg';
  return (
    <div className="container mx-auto px-4 py-24 mb:py-32 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
<div
  className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in"
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  onClick={openFullscreen}    
  ref={zoomRef}
>
  {currentImage && (
    <Image
      src={currentImage}
      alt={product.title}
      fill
      className="object-cover transition-transform duration-300"
      style={{
        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
        transform: zoomActive ? 'scale(1.2)' : 'scale(1)',
      }}
    />
  )}

  {product.featured && (
    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
      Öne Çıkan
    </div>
  )}
</div>


          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
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
                      onClick={() => isAuthenticated && handleRating(i + 1)}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.average_rating.toFixed(1)}) {product.rating_count} değerlendirme
                </span>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={hasLiked ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`w-4 h-4 mr-1 ${hasLiked ? "fill-current" : ""}`} />
                {product.likes_count} Beğeni
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommentInput(!showCommentInput)}
                disabled={!isAuthenticated}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {product.comments_count} Yorum
              </Button>
            </div>

            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mb-4">
                Lütfen bu ürünü beğenmek, değerlendirmek veya yorum yapmak için giriş yapın.
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
            onClick={handleAddToCart}
            disabled={isAddingToCart || !product.stock}
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAddingToCart ? "Sepete Ekleniyor..." : !product.stock ? "Stokta mevcut değil." : "Sepete Ekle"}
          </Button>
        </div>
      </div>

      {/* Comment Input Section */}
      {showCommentInput && isAuthenticated && (
        <div className="mt-8">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Yorum Ekle</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <Textarea
                  placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {newComment.length}/500 karakter
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCommentInput(false);
                        setNewComment("");
                      }}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleAddComment}
                      disabled={isAddingComment || !newComment.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isAddingComment ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Kullanıcı Yorumları</h3>
          {isAuthenticated && !showCommentInput && (
            <Button
              variant="outline"
              onClick={() => setShowCommentInput(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Yorum Ekle
            </Button>
          )}
        </div>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {comment.user_avatar ? (
                      <Image
                        src={comment.user_avatar}
                        alt={comment.username}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.username}</span>
                      <span className="text-sm text-gray-500">{comment.time_ago}</span>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <CardContent>
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Daha önce yorum yapılmamış. İlk yorumunuzu paylaşın!</p>
              {isAuthenticated && !showCommentInput && (
                <Button onClick={() => setShowCommentInput(true)}>
                  Yorum Yaz
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {isFullscreenOpen && (
  <div
  className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 cursor-zoom-out"
    onClick={closeFullscreen}
  >
    <Image
      src={currentImage}
      alt={product.title}
      width={800}   
      height={800}
      className="object-contain p-8 max-h-full max-w-full"
      priority
    />
  </div>
)}
    </div>
    
  );
};

export default ProductDetailSection;