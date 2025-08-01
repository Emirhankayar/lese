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
        <CardContent className="p-6 md:p-8 text-center">
          <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2">Sepetiniz boş</h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Başlamak için bazı ürünler ekleyin!</p>
          <Button 
            onClick={() => window.location.href = '/shop'}
            className="w-full md:w-auto"
          >
            Alışverişe Devam Et
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          Sipariş Özeti
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {/* Item Count */}
        <div className="flex justify-between text-sm md:text-base">
          <span>Ürünler ({summary.itemCount})</span>
          <span>₺{summary.subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm md:text-base">
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Kargo
          </span>
          <span>
            {summary.shipping === 0 ? 'ÜCRETSİZ' : `₺${summary.shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm md:text-base">
          <span>Vergi</span>
          <span>₺{summary.tax.toFixed(2)}</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg md:text-xl font-bold">
          <span>Toplam</span>
          <span className="text-blue-600">₺{summary.total.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={onProceedToCheckout}
          disabled={isProcessing || summary.itemCount === 0}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isProcessing ? 'İşleniyor...' : 'Ödemeye Geç'}
        </Button>

        {/* Free Shipping Notice */}
        {summary.shipping === 0 && summary.subtotal > 0 && (
          <div className="text-xs md:text-sm text-green-600 text-center bg-green-50 p-2 md:p-3 rounded">
            🎉 Ücretsiz kargo hakkını kazandınız!
          </div>
        )}

        {/* Security Notice */}
        <div className="text-xs md:text-sm text-gray-500 text-center">
          🔒 Stripe tarafından desteklenen güvenli ödeme
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummaryComponent;