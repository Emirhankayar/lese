"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/sbClient";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { notFound } from "next/navigation";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";

interface ProductProps {
  id: string;
  title: string;
  price: number;
  description: string[] | null;
  category: string[] | null;
  images: string[];
  weight: number[] | null;
  weight_unit: string[] | null;
  size: number[] | null;
  size_unit: string[] | null;
  rating: number;
  clicks: number;
}

export default function ProductDetailSection() {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !data) {
        console.error(error);
        setProduct(null);
      } else {
        data.price = typeof data.price === "string" ? parseFloat(data.price) : data.price;

        setProduct(data);
        setSelectedImage(data.images[0]);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return notFound();

  const socialIcon = (name: string) => {
    switch (name) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "X":
        return <XIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="container lg:w-[75%] py-24 sm:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* IMAGE SECTION */}
        <div>
          <Zoom>
            <Image
              src={selectedImage!}
              alt={product.title}
              width={600}
              height={600}
              className="w-full object-cover rounded-xl cursor-zoom-in"
            />
          </Zoom>
          <div className="flex gap-4 mt-4">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(img)}>
                <Image
                  src={img}
                  alt={`Thumbnail ${i}`}
                  width={80}
                  height={80}
                  className={`rounded-md border ${
                    selectedImage === img ? "border-blue-500" : "border-gray-300"
                  } cursor-pointer`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl text-primary mb-4">${product.price.toFixed(2)}</p>

          <div className="mb-4">
            {(product.category ?? []).map((cat, i) => (
              <span key={i} className="text-muted-foreground">
                {cat}
                {i < (product.category?.length ?? 0) - 1 ? ", " : ""}
              </span>
            ))}
          </div>

          <div className="space-y-2 text-muted-foreground mb-6">
            {(product.description ?? []).map((desc, i) => (
              <p key={i}>{desc}</p>
            ))}
          </div>

          {/* Remove or add social links only if your DB has that field */}
          {/* 
          <div className="flex space-x-4 mb-8">
            {product.link?.map((link, i) => (
              <Link key={i} href={link.url} target="_blank" className="hover:opacity-80">
                {socialIcon(link.name)}
              </Link>
            ))}
          </div>
          */}

          <button className="px-6 py-3 rounded-lg hover:bg-primary/80">Satın Al</button>
        </div>
      </div>
    </div>
  );
}
