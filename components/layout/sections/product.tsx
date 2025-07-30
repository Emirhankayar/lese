  "use client";

  import { useEffect, useState } from "react";
  import { supabase } from "@/lib/sbClient";

  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
  } from "@/components/ui/card";
  import Image from "next/image";
  import Link from "next/link";

  interface ProductView {
    id: string;
    title: string;
    price: number;
    description: string | null;
    category: string | null;
    image: string; 
    date_published: string;
    rating: number;
    clicks: number;
  }

  export const ProductSection = () => {
    
    const [products, setProducts] = useState<ProductView[]>([]);

    useEffect(() => {
      const fetchProducts = async () => {
        const { data, error } = await supabase.from("product_views").select("*");
        
          

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setProducts(data || []);
        }
      };

      fetchProducts();
    }, [supabase]);

    return (
      <section id="product" className="container lg:w-[75%] py-24 sm:py-32">
        <div className="text-center mb-8">
          <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
            Online-Sipariş
          </h2>
          <h2 className="text-3xl md:text-4xl text-center font-bold">
            Ürünler ve Hizmetler
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6">
                  {product.title}
                  <span className="text-primary ml-2">
                    {product.price.toFixed(2)}$
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-0 text-muted-foreground">
                {product.category}
              </CardContent>
{product.description && (
  <CardContent className="text-sm text-muted-foreground pb-6">
    {(() => {
      const descStr = Array.isArray(product.description) 
        ? product.description.join(" ") 
        : product.description;
      return descStr.length > 100 ? descStr.slice(0, 100) + "..." : descStr;
    })()}
  </CardContent>
)}


              <CardFooter className="space-x-4 mt-auto">
                <Link href={`/shop/${product.id}`}>Satın Al</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    );
  };
