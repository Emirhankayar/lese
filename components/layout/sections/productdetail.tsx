"use client";

import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { notFound } from "next/navigation";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import Link from "next/link";
import { useState } from "react";

interface ProductProps {
  productId: string;
  productImage: string[];
  productName: string;
  productPrice: string;
  productCategory: string[];
  productDescription: string[];
  productLink: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

const productList: ProductProps[] = [
  {
    productId: "1",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },
    {
    productId: "2",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },
    {
    productId: "3",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },
    {
    productId: "4",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },
    {
    productId: "5",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },
    {
    productId: "6",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },
    {
    productId: "7",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },
    {
    productId: "8",
    productImage: [
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop",
"https://images.unsplash.com/photo-1605701249987-f0bb9b505d06?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://plus.unsplash.com/premium_photo-1723759330931-1d52b4a1e6ea?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    ],
    productName: "Ürün İsmi 1",
    productPrice: "- 25$",
    productCategory: ["Ürün kategorısı"],
    productDescription: ["This is a sample product description for the product."],
    productLink: [{ name: "X", url: "https://x.com/leo_mirand4" }],
  },

];

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const product = productList.find((p) => p.productId === productId);

  if (!product) return notFound();

  const [selectedImage, setSelectedImage] = useState(product.productImage[0]);

  const socialIcon = (name: string) => {
    switch (name) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "X":
        return <XIcon />;
    }
  };

  return (
    <div className="container lg:w-[75%] py-24 sm:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* IMAGE SECTION */}
        <div>
          {/* Main Zoomable Image */}
          <Zoom>
            <Image
              src={selectedImage}
              alt={product.productName}
              width={600}
              height={600}
              className="w-full object-cover rounded-xl cursor-zoom-in"
            />
          </Zoom>

          {/* Thumbnail Images */}
          <div className="flex gap-4 mt-4">
            {product.productImage.map((img, i) => (
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
          <h1 className="text-4xl font-bold mb-4">{product.productName}</h1>
          <p className="text-2xl text-primary mb-4">{product.productPrice}</p>
          <div className="mb-4">
            {product.productCategory.map((cat, i) => (
              <span key={i} className="text-muted-foreground">
                {cat}
                {i < product.productCategory.length - 1 && ", "}
              </span>
            ))}
          </div>
          <div className="space-y-2 text-muted-foreground mb-6">
            {product.productDescription.map((desc, i) => (
              <p key={i}>{desc}</p>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mb-8">
            {product.productLink.map((link, i) => (
              <Link key={i} href={link.url} target="_blank" className="hover:opacity-80">
                {socialIcon(link.name)}
              </Link>
            ))}
          </div>

          {/* Buy Button */}
          <button className="px-6 py-3 rounded-lg hover:bg-primary/80">
            Satın Al
          </button>
        </div>
      </div>
    </div>
  );
}
