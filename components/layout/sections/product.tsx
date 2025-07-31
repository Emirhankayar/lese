"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/sbClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductFromFunction {
  id: string;
  title: string;
  price: string[];
  category: string[];
  images: string[];
  stock: boolean;
  featured: boolean;
  date_published: string;
  avg_rating: number;
  rating_count: number;
  like_count: number;
  primary_image: string;
  primary_category: string;
  price_display: string;
}

interface ProductSectionProps {
  limit?: number;
  categoryFilter?: string;
  featuredOnly?: boolean;
  searchTerm?: string;
}

export const ProductSection = ({ 
  limit = 20, 
  categoryFilter,
  featuredOnly = false,
  searchTerm 
}: ProductSectionProps) => {
  const [products, setProducts] = useState<ProductFromFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();

      try {
        setLoading(true);
        setError(null);

        // Use the simplified database function
        const { data, error } = await supabase.rpc('get_shop_products_simple', {
          limit_count: limit,
          offset_count: 0,
          category_filter: categoryFilter || null,
          in_stock_only: true,
          featured_only: featuredOnly,
          search_term: searchTerm || null
        });

        if (error) {
          console.error("Error fetching products:", error);
          setError("Failed to load products");
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, categoryFilter, featuredOnly, searchTerm]);

  if (loading) {
    return (
      <section id="product" className="container lg:w-[75%] py-24 sm:py-32">
        <div className="text-center mb-8">
          <h2 className="text-lg text-primary mb-2">Online-Sipariş</h2>
          <h2 className="text-3xl md:text-4xl font-bold">Ürünler ve Hizmetler</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="bg-muted/60 dark:bg-card animate-pulse">
              <div className="h-[300px] bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
              <div className="p-6 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="product" className="container lg:w-[75%] py-24 sm:py-32">
        <div className="text-center mb-8">
          <h2 className="text-lg text-primary mb-2">Online-Sipariş</h2>
          <h2 className="text-3xl md:text-4xl font-bold">Ürünler ve Hizmetler</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Tekrar Dene
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="product" className="container lg:w-[75%] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary mb-2">Online-Sipariş</h2>
        <h2 className="text-3xl md:text-4xl font-bold">Ürünler ve Hizmetler</h2>
        {(categoryFilter || searchTerm) && (
          <p className="text-muted-foreground mt-2">
            {searchTerm && `Search: "${searchTerm}"`}
            {searchTerm && categoryFilter && " | "}
            {categoryFilter && `Category: ${categoryFilter}`}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || categoryFilter 
              ? "No products found matching your criteria." 
              : "Henüz ürün bulunmuyor."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0 relative">
                <div className="h-full overflow-hidden relative">
                  <Image
                    src={product.primary_image}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                  
                  {/* Featured badge */}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                      Öne Çıkan
                    </div>
                  )}
                  
                  {/* Stock status overlay */}
                  {!product.stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Stokta Yok</span>
                    </div>
                  )}
                  
                  {/* Likes count */}
                  {product.like_count > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {product.like_count}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4">
                  <CardTitle className="text-lg font-bold mb-2 line-clamp-2">
                    {product.title}
                  </CardTitle>
                  
                  <div className="text-xl font-bold text-primary mb-2">
                    {product.price_display}
                  </div>
                  
                  {/* Rating display */}
                  <div className="flex items-center gap-1 mb-2">
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(product.avg_rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))}
  </div>
  <span className="text-sm text-muted-foreground">
    ({product.avg_rating.toFixed(1)}) {product.rating_count}
  </span>
</div>

                </div>
              </CardHeader>

              <CardContent className="pb-2 flex-grow">
                <div className="flex flex-wrap gap-1">
                  {product.category?.slice(0, 2).map((cat, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                  {product.category?.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.category.length - 2} daha
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="mt-auto pt-4">
                <Link
                  href={`/shop/${product.id}`}
                  className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors ${
                    product.stock
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {product.stock ? "Ürünü İncele" : "Stokta Yok"}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};