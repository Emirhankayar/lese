"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/sbClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Product, Comment, parseArray } from "@/lib/types";
import ProductGallery from "@/components/ui/product-gallery";
import ProductInfo from "@/components/ui/product-info";
import Comments from "@/components/ui/product-comments";
import { LoadingState, ErrorState } from "@/components/ui/loading-error-states";
import AuthModal from "@/components/ui/auth-modal"; 

const ProductDetailSection = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<'cart' | 'like' | 'comment' | 'rate'>('cart');
  
  const refreshProductData = async () => {
    if (!productId) return;
    
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);      
        return;
      }
      
      const { data, error } = await supabase.rpc('get_product_with_details', {
        product_uuid: productId,
        user_uuid: user?.id || null,
        comments_limit: 10
      });
      
      if (!error && data) {
        setProduct(data.product);
        setComments(data.comments || []);
        
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

    // Check authentication and show modal if needed
    if (!isAuthenticated) {
      setAuthAction('cart');
      setShowAuthModal(true);
      return;
    }

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
        setAlert({ type: "error", text: `Sepete eklenemedi: ${error.message}` });
      } else if (data?.success) {
        setAlert({ type: "success", text: "Ürün sepete eklendi!" });
        await refreshProductData();
      } else {
        setAlert({ type: "error", text: `Sepete eklenemedi: ${data?.error || 'Bilinmeyen hata'}` });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setAlert({ type: "error", text: "Sepete eklenemedi" });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLike = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      setAuthAction('like');
      setShowAuthModal(true);
      return;
    }

    const supabase = createClient();

    try {
      console.log('Attempting to like product:', product.id);

      const { data, error } = await supabase.rpc('toggle_product_like', {
        product_uuid: product.id,
      });

      console.log('Like response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setAlert({ type: "error", text: `Beğenme hatası: ${error.message}` });
        return;
      }

      if (data?.success) {
        setHasLiked(data.liked);
        setProduct(prev =>
          prev
            ? {
                ...prev,
                likes_count: data.like_count,
              }
            : null,
        );

        await refreshProductData();
      } else {
        console.error('Function returned error:', data?.error);
        setAlert({ type: "error", text: `Hata: ${data?.error || 'Bilinmeyen hata'}` });
      }
    } catch (err) {
      console.error('Unexpected error toggling like:', err);
      setAlert({ type: "error", text: "Beklenmeyen bir hata oluştu" });
    }
  };

  const handleRating = async (rating: number) => {
    if (!product) return;
    
    if (!isAuthenticated) {
      setAuthAction('rate');
      setShowAuthModal(true);
      return;
    }

    const supabase = createClient();

    try {
      console.log('Attempting to rate product:', product.id, 'with rating:', rating);

      const { data, error } = await supabase.rpc('set_product_rating', {
        product_uuid: product.id,
        rating_value: rating,
      });

      console.log('Rating response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setAlert({ type: "error", text: `Puanlama hatası: ${error.message}` });
        return;
      }

      if (data?.success) {
        setUserRating(rating);
        setProduct(prev =>
          prev
            ? {
                ...prev,
                average_rating: data.avg_rating,
                rating_count: data.rating_count,
              }
            : null,
        );

        await refreshProductData();
      } else {
        console.error('Function returned error:', data?.error);
        setAlert({ type: "error", text: `Hata: ${data?.error || 'Bilinmeyen hata'}` });
      }
    } catch (err) {
      console.error('Unexpected error setting rating:', err);
      setAlert({ type: "error", text: "Beklenmeyen bir hata oluştu" });
    }
  };

  const handleAddComment = async (commentText: string) => {
    if (!product) return;
    
    if (!isAuthenticated) {
      setAuthAction('comment');
      setShowAuthModal(true);
      return;
    }

    setIsAddingComment(true);
    const supabase = createClient();

    try {
      console.log('Ürüne yorum ekleniyor:', product.id);

      const { data, error } = await supabase.rpc('add_product_comment', {
        product_uuid: product.id,
        comment_text: commentText,
      });

      console.log('Comment response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setAlert({ type: "error", text: `Yorum eklenirken hata oluştu: ${error.message}` });
        return;
      }

      if (data?.success) {
        await refreshProductData();
        setAlert({ type: "success", text: 'Yorum başarıyla eklendi!' });
      } else {
        console.error('Function returned error:', data?.error);
        setAlert({ type: "error", text: `Hata: ${data?.error || 'Bilinmeyen hata'}` });
      }
    } catch (err) {
      console.error('Unexpected error adding comment:', err);
      setAlert({ type: "error", text: "Beklenmeyen bir hata oluştu" });
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleShowComments = () => {
    const commentsSection = document.querySelector('[data-comments-section]');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleAuthLogin = () => {
    window.location.href = '/auth';
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !product) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-24 mb:py-32 max-w-6xl">
      {alert && (
        <Alert
          variant={alert.type === "error" ? "destructive" : "default"}
          className="mb-6"
        >
          <AlertDescription>{alert.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <ProductGallery product={product} />

        {/* Product Info */}
        <ProductInfo
          product={product}
          userRating={userRating}
          hasLiked={hasLiked}
          isAuthenticated={isAuthenticated}
          onRating={handleRating}
          onLike={handleLike}
          onAddToCart={handleAddToCart}
          onShowComments={handleShowComments}
          isAddingToCart={isAddingToCart}
        />
      </div>

      {/* Comments Section */}
      <div data-comments-section>
        <Comments
          comments={comments}
          isAuthenticated={isAuthenticated}
          onAddComment={handleAddComment}
          isAddingComment={isAddingComment}
        />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        action={authAction}
        onLogin={handleAuthLogin}
      />
    </div>
  );
};

export default ProductDetailSection;