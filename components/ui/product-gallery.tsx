"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Product, parseArray } from "@/lib/types";

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const zoomRef = useRef<HTMLDivElement>(null);

  const images = parseArray(product.images).filter(img => img && img.trim() !== '');
  const currentImage = (images.length > 0 && images[selectedImageIndex]) 
    ? images[selectedImageIndex] 
    : product.primary_image || 'https://zelzrvosxgydwzufatbt.supabase.co/storage/v1/object/public/placeholders/placeholder-product.jpg';

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

  const openFullscreen = () => setIsFullscreenOpen(true);
  const closeFullscreen = () => setIsFullscreenOpen(false);

  return (
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

      {/* Fullscreen Modal */}
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

export default ProductGallery;