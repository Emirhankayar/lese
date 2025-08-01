"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { CartItem } from "@/lib/checkout-types";

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (itemId: string, newQuantity: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
  isUpdating: boolean;
}

const CartItemComponent = ({ item, onQuantityChange, onRemoveItem, isUpdating }: CartItemProps) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityIncrease = async () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    await onQuantityChange(item.id, newQuantity);
  };

  const handleQuantityDecrease = async () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      await onQuantityChange(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemoveItem(item.id);
  };

  const unitPrice = parseFloat(item.selected_price);
  const totalPrice = unitPrice * localQuantity;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={item.product_image || '/placeholder-product.jpg'}
              alt={item.product_title}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{item.product_title}</h3>
                <p className="text-sm text-gray-600 mt-1">Added {item.time_ago}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isRemoving || isUpdating}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Variants */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                <Package className="w-3 h-3 mr-1" />
                ${item.selected_price}
              </Badge>
              {item.selected_size && (
                <Badge variant="outline" className="text-xs">
                  Size: {item.selected_size}
                </Badge>
              )}
              {item.selected_weight && (
                <Badge variant="outline" className="text-xs">
                  Weight: {item.selected_weight}
                </Badge>
              )}
            </div>

            {/* Quantity Controls and Price */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleQuantityDecrease}
                    disabled={localQuantity <= 1 || isUpdating}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                    {localQuantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleQuantityIncrease}
                    disabled={isUpdating}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </div>
                {localQuantity > 1 && (
                  <div className="text-xs text-gray-500">
                    ${unitPrice.toFixed(2)} each
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemComponent;