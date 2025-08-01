"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/sbClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ShoppingBag, RefreshCw } from "lucide-react";
import { CartItem, CartSummary } from "@/lib/checkout-types";
import CartItemComponent from "@/components/ui/cart-item";
import CartSummaryComponent from "@/components/ui/cart-summary";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const cartSummary: CartSummary = {
    subtotal: cartItems.reduce((sum, item) => sum + item.total_price, 0),
    tax: cartItems.reduce((sum, item) => sum + item.total_price, 0) * 0.08, // 8% tax
    shipping: cartItems.reduce((sum, item) => sum + item.total_price, 0) > 50 ? 0 : 9.99, // Free shipping over $50
    total: 0,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
  
  cartSummary.total = cartSummary.subtotal + cartSummary.tax + cartSummary.shipping;

const fetchCartItems = async () => {
  setLoading(true);
  setError(null);

  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthenticated(false);
      setError("Sepetinizi görüntülemek için lütfen giriş yapın.");
      return;
    }
    
    setIsAuthenticated(true);

    const { data, error } = await supabase.rpc('get_cart_items', {
      limit_count: 100,
      offset_count: 0
    });

    if (error) {
      console.error('Error fetching cart items:', error);
      setError("Sepet öğelerini yüklerken hata oluştu");
      return;
    }

    setCartItems(data || []);

  } catch (err) {
    console.error("Unexpected error:", err);
    setError("Beklenmedik bir hata oluştu");
  } finally {
    setLoading(false);
  }
};

const updateOrderQuantity = async (orderId: string, newQuantity: number) => {
  setIsUpdating(true);
  
  try {
    const supabase = createClient();
    
    // Use the proper RPC function
    const { data, error } = await supabase.rpc('update_cart_item_quantity', {
      order_uuid: orderId,
      new_quantity: newQuantity
    });

    if (error) {
      console.error('Error updating quantity:', error);
      alert(`Miktar güncellenirken hata oluştu: ${error.message}`);
      return;
    }

    // Check the response from the RPC function
    if (!data?.success) {
      console.error('RPC function returned error:', data?.error);
      alert(`Miktar güncellenirken hata oluştu: ${data?.error || 'Bilinmeyen hata'}`);
      return;
    }

    // Update local state with the response data
    setCartItems(prev => prev.map(item => 
      item.id === orderId 
        ? { ...item, quantity: data.new_quantity, total_price: data.new_total }
        : item
    ));

  } catch (err) {
    console.error("Unexpected error updating quantity:", err);
    alert("Miktar güncellenirken hata oluştu");
  } finally {
    setIsUpdating(false);
  }
};

// Fixed removeCartItem to use the proper RPC function
const removeCartItem = async (orderId: string) => {
  setIsUpdating(true);
  
  try {
    const supabase = createClient();
    
    // Use the proper RPC function instead of direct delete
    const { data, error } = await supabase.rpc('remove_cart_item', {
      order_uuid: orderId
    });

    if (error) {
      console.error('Error removing item:', error);
      alert(`Öğeyi kaldırırken hata oluştu: ${error.message}`);
      return;
    }

    // Check the response from the RPC function
    if (!data?.success) {
      console.error('RPC function returned error:', data?.error);
      alert(`Öğeyi kaldırırken hata oluştu: ${data?.error || 'Bilinmeyen hata'}`);
      return;
    }

    // Update local state - remove the item from the cart
    setCartItems(prev => prev.filter(item => item.id !== orderId));

    console.log('Öğe başarıyla kaldırıldı:', orderId);

  } catch (err) {
    console.error("Unexpected error removing item:", err);
    alert("Öğeyi kaldırırken hata oluştu");
  } finally {
    setIsUpdating(false);
  }
};


  const handleProceedToCheckout = async () => {
    
    alert("Stripe integration will be implemented here!");
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <Card className="p-8 text-center max-w-md mx-auto">
          <CardContent>
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Giriş Yapmanız Gerekli!</h3>
            <p className="text-gray-600 mb-4">Sepetinizi görüntülemek için lütfen giriş yapın.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Sepet</h1>
          <p className="text-gray-600">
            {cartItems.length > 0 
              ? `${cartItems.length} öğe${cartItems.length !== 1 ? 'ler' : ''} sepetinizde`
              : 'Sepetiniz boş'
            }
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchCartItems}
          disabled={loading}
          className="ml-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sepetiniz Boş</h3>
            <p className="text-gray-600 mb-6">
              Görünüşe göre henüz sepetinize herhangi bir ürün eklemediniz.
            </p>
            <Button onClick={() => window.location.href = '/shop'}>
              Alışverişe Başla
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Sepet Öğeleri ({cartItems.length})
                </CardTitle>
              </CardHeader>
            </Card>
            
            {cartItems.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onQuantityChange={updateOrderQuantity}
                onRemoveItem={removeCartItem}
                isUpdating={isUpdating}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummaryComponent
              summary={cartSummary}
              onProceedToCheckout={handleProceedToCheckout}
              isProcessing={isUpdating}
            />
          </div>
        </div>
      )}

      {/* Continue Shopping */}
      {cartItems.length > 0 && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/shop'}
          >
            Alışverişe Devam Et
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;