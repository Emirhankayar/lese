"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Truck } from "lucide-react";
import { CartSummary } from "@/lib/checkout-types";

interface CartSummaryProps {
  summary: CartSummary;
  onProceedToCheckout: () => void;
  isProcessing: boolean;
}

const CartSummaryComponent = ({ summary, onProceedToCheckout, isProcessing }: CartSummaryProps) => {
  if (summary.itemCount === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-4">Add some products to get started!</p>
          <Button onClick={() => window.location.href = '/shop'}>
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item Count */}
        <div className="flex justify-between text-sm">
          <span>Items ({summary.itemCount})</span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Shipping
          </span>
          <span>
            {summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${summary.tax.toFixed(2)}</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">${summary.total.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={onProceedToCheckout}
          disabled={isProcessing || summary.itemCount === 0}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
        </Button>

        {/* Free Shipping Notice */}
        {summary.shipping === 0 && summary.subtotal > 0 && (
          <div className="text-xs text-green-600 text-center bg-green-50 p-2 rounded">
            🎉 You qualify for free shipping!
          </div>
        )}

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center">
          🔒 Secure checkout powered by Stripe
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummaryComponent;