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
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const cartSummary: CartSummary = {
    subtotal: cartItems.reduce((sum, item) => sum + item.total_price, 0),
    tax: cartItems.reduce((sum, item) => sum + item.total_price, 0) * 0.2, // 20% KDV
    shipping: cartItems.reduce((sum, item) => sum + item.total_price, 0) > 50 ? 0 : 9.99, // 50 TL üzeri ücretsiz kargo
    total: 0,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
  
  cartSummary.total = cartSummary.subtotal + cartSummary.tax;

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
      console.error('Sepet öğelerini getirirken hata:', error);
      setError("Sepet öğelerini yüklerken hata oluştu");
      return;
    }

    setCartItems(data || []);

  } catch (err) {
    console.error("Beklenmedik hata:", err);
    setError("Beklenmedik bir hata oluştu");
  } finally {
    setLoading(false);
  }
};

const updateOrderQuantity = async (orderId: string, newQuantity: number) => {
  setIsUpdating(true);
  
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase.rpc('update_cart_item_quantity', {
      order_uuid: orderId,
      new_quantity: newQuantity
    });

    if (error) {
      console.error('Miktar güncellenirken hata:', error);
      alert(`Miktar güncellenirken hata oluştu: ${error.message}`);
      return;
    }

    if (!data?.success) {
      console.error('RPC fonksiyonu hata döndürdü:', data?.error);
      alert(`Miktar güncellenirken hata oluştu: ${data?.error || 'Bilinmeyen hata'}`);
      return;
    }

    setCartItems(prev => prev.map(item => 
      item.id === orderId 
        ? { ...item, quantity: data.new_quantity, total_price: data.new_total }
        : item
    ));

  } catch (err) {
    console.error("Miktar güncellenirken beklenmedik hata:", err);
    alert("Miktar güncellenirken hata oluştu");
  } finally {
    setIsUpdating(false);
  }
};

const removeCartItem = async (orderId: string) => {
  setIsUpdating(true);
  
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase.rpc('remove_cart_item', {
      order_uuid: orderId
    });

    if (error) {
      console.error('Öğe kaldırılırken hata:', error);
      alert(`Öğeyi kaldırırken hata oluştu: ${error.message}`);
      return;
    }

    if (!data?.success) {
      console.error('RPC fonksiyonu hata döndürdü:', data?.error);
      alert(`Öğeyi kaldırırken hata oluştu: ${data?.error || 'Bilinmeyen hata'}`);
      return;
    }

    setCartItems(prev => prev.filter(item => item.id !== orderId));

    console.log('Öğe başarıyla kaldırıldı:', orderId);

  } catch (err) {
    console.error("Öğe kaldırılırken beklenmedik hata:", err);
    alert("Öğeyi kaldırırken hata oluştu");
  } finally {
    setIsUpdating(false);
  }
};

const handleProceedToCheckout = async () => {
  setIsProcessingCheckout(true);
  
  try {
    const supabase = createClient();
    
    // Get all cart item IDs
    const orderIds = cartItems.map(item => item.id);
    
    if (orderIds.length === 0) {
      alert("Sepetinizde ürün bulunmuyor.");
      return;
    }

    // Update status column to 'pending' - DB trigger will handle the rest
    const { error } = await supabase
      .from('orders')
      .update({ status: 'pending' })
      .in('id', orderIds);

    if (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
      alert(`Sipariş işlenirken hata oluştu: ${error.message}`);
      return;
    }

    // Show success message
    alert("Siparişiniz başarıyla oluşturuldu! Durum: Beklemede");
    
    // Clear the cart items from local state since they're now pending orders
    setCartItems([]);

  } catch (err) {
    console.error("Sipariş işlenirken beklenmedik hata:", err);
    alert("Sipariş işlenirken hata oluştu");
  } finally {
    setIsProcessingCheckout(false);
  }
};

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
        <div className="space-y-6">
          <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-1/2 md:w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 md:h-32 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-48 md:h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
        <Card className="p-6 md:p-8 text-center max-w-md mx-auto">
          <CardContent className="p-0">
            <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Giriş Yapmanız Gerekli!</h3>
            <p className="text-gray-600 mb-4 text-sm md:text-base">Sepetinizi görüntülemek için lütfen giriş yapın.</p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="w-full md:w-auto"
            >
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Button>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">Sepet</h1>
          <p className="text-gray-600 text-sm md:text-base">
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
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertDescription className="text-sm md:text-base">{error}</AlertDescription>
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Card className="p-6 md:p-8 text-center">
          <CardContent className="p-0">
            <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">Sepetiniz Boş</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Görünüşe göre henüz sepetinize herhangi bir ürün eklemediniz.
            </p>
            <Button 
              onClick={() => window.location.href = '/shop'}
              className="w-full md:w-auto"
            >
              Alışverişe Başla
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-3 md:p-4">
              <CardHeader className="px-0 pt-0 pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
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

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummaryComponent
              summary={cartSummary}
              onProceedToCheckout={handleProceedToCheckout}
              isProcessing={isUpdating || isProcessingCheckout}
            />
          </div>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-6 md:mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/shop'}
            className="w-full md:w-auto"
          >
            Alışverişe Devam Et
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;