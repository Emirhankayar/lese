// app/profile/page.tsx - Complete profile page with direct Supabase calls
'use client'
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/sbClient';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, Heart, Settings, Truck, CheckCircle, Clock, XCircle,
  Camera, Save, Eye, Loader2, Trash2, ShoppingCart, History
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
// Types
interface User {
  id: string;
  email?: string;
}

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
}

interface Order {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  quantity: number;
  selected_price: number;
  total_price: number;
  time_ago: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled' | 'cart';
}

interface LikedProduct {
  id: string;
  title: string;
  primary_image: string;
  price_display: string;
  primary_category: string;
  liked_at: string;
}

interface EditForm {
  full_name: string;
  avatar_url: string;
}

// Free avatar options
const avatarOptions: string[] = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  'https://api.dicebear.com/7.x/personas/svg?seed=David',
  'https://api.dicebear.com/7.x/personas/svg?seed=Lisa',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Happy',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Joy',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Explorer',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Wanderer'
];

export default function ProfilePage(): JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditForm>({ full_name: '', avatar_url: '' });
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [showAvatarDialog, setShowAvatarDialog] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Check authentication and load data
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async (): Promise<void> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/auth'); // Redirect to your login page
        return;
      }
      
      setUser(user);
      await Promise.all([
        loadProfile(user.id),
        loadOrders(),
        loadLikedProducts(user.id)
      ]);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setEditForm({
        full_name: data.full_name || '',
        avatar_url: data.avatar_url || avatarOptions[0]
      });
      setSelectedAvatar(data.avatar_url || avatarOptions[0]);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    }
  };

  const loadOrders = async (): Promise<void> => {
    try {
      // Using your database function
      const { data, error } = await supabase
        .rpc('get_user_orders', {
          limit_count: 50,
          offset_count: 0
        });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadLikedProducts = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          id,
          created_at,
          products:product_id (
            id,
            title,
            price,
            images,
            category
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data
      const transformedData: LikedProduct[] = data.map((like: any) => ({
        id: like.products.id,
        title: like.products.title,
        primary_image: like.products.images?.[0] || '/placeholder-product.jpg',
        price_display: Array.isArray(like.products.price) 
          ? like.products.price.length === 1 
            ? `$${like.products.price[0]}`
            : `$${Math.min(...like.products.price.map(Number))} - $${Math.max(...like.products.price.map(Number))}`
          : '$0.00',
        primary_category: like.products.category?.[0] || 'Uncategorized',
        liked_at: like.created_at
      }));

      setLikedProducts(transformedData);
    } catch (error) {
      console.error('Error loading liked products:', error);
    }
  };

  const handleSaveProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUnlikeProduct = async (productId: string): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setLikedProducts(prev => prev.filter(product => product.id !== productId));
      
      toast({
        title: "Product unliked",
        description: "Product removed from your likes.",
      });
    } catch (error) {
      console.error('Error unliking product:', error);
      toast({
        title: "Error",
        description: "Failed to unlike product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromCart = async (orderId: string): Promise<void> => {
    if (!user) return;
    
    try {
      // Assuming you have an orders table where you can delete cart items
      const { error } = await supabase
        .from('orders') // or your cart table name
        .delete()
        .eq('id', orderId)
        .eq('status', 'cart');

      if (error) throw error;

      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      toast({
        title: "Ürün sepetten kaldırıldı",
        description: "Ürün sepetinizden başarıyla kaldırıldı.",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Hata",
        description: "Ürün sepetten kaldırılırken hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarSelect = (avatarUrl: string): void => {
    setSelectedAvatar(avatarUrl);
    setEditForm({ ...editForm, avatar_url: avatarUrl });
    setShowAvatarDialog(false);
  };

  // Utility functions
  const getStatusIcon = (status: Order['status']): JSX.Element => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cart':
        return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'cart':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

// Component definitions
  const OrderCard = ({ order, showRemoveButton = false }: { order: Order; showRemoveButton?: boolean }): JSX.Element => (
    <Card className="mb-4">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
          <Image
            src={order.product_image}
            alt={order.product_title}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base truncate">{order.product_title}</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Qty: {order.quantity} × ${order.selected_price}
            </p>
            <p className="text-xs sm:text-sm font-medium">Total: ${order.total_price}</p>
            <p className="text-xs text-gray-500">{order.time_ago}</p>
          </div>
          <div className="flex flex-col items-end space-y-1 sm:space-y-2 flex-shrink-0">
            <Badge className={`${getStatusColor(order.status)} text-xs`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className="capitalize hidden sm:inline">{order.status === 'cart' ? 'sepet' : order.status}</span>
                <span className="capitalize sm:hidden">{order.status === 'cart' ? 'sep' : order.status.slice(0, 3)}</span>
              </div>
            </Badge>
          <Link href={`/shop/${order.product_id}`} className="inline-block">
            <Button variant="outline" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 cursor-pointer">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
            {showRemoveButton && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRemoveFromCart(order.id)}
                className="text-red-500 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0 mt-2"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

const LikedProductCard = ({ product }: { product: LikedProduct }): JSX.Element => (
  <Card className="mb-4 w-full hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-3 sm:p-4 w-full">
      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 w-full">
        <Image
          src={product.primary_image}
          alt={product.title}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold py-1 text-sm sm:text-base truncate">{product.title}</h4>
          <p className="text-xs sm:text-sm py-1 text-gray-600 truncate">{product.primary_category}</p>
          <p className="text-xs sm:text-sm py-1 font-medium text-green-600">{product.price_display}</p>
        </div>
        <div className="flex flex-col items-end space-y-1 sm:space-y-2 flex-shrink-0">
            <Badge className="text-red-500 text-xs bg-red-200">
                <Heart className="h-4 w-4 mr-1" />Beğeni
                
            </Badge>
          <Link href={`/shop/${product.id}`} className="inline-block">
            <Button variant="outline" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 cursor-pointer">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleUnlikeProduct(product.id)}
            className="text-red-500 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);



  const LoadingSkeleton = (): JSX.Element => (
    <div className="container mx-auto px-3 sm:px-4 py-20 sm:py-24 mb:py-32 max-w-4xl">
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
            <div className="flex-1 w-full sm:w-auto">
              <Skeleton className="h-6 sm:h-8 w-full sm:w-48 mb-2" />
              <Skeleton className="h-4 w-full sm:w-64" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-full sm:w-32" />
          </div>
        </CardHeader>
      </Card>
      <div className="space-y-4">
        <Skeleton className="h-10 sm:h-12 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3 sm:p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Filter orders by status
  const cartOrders: Order[] = orders.filter(order => order.status === 'cart');
  const deliveredOrders: Order[] = orders.filter(order => order.status === 'delivered');
  const trackingOrders: Order[] = orders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cart'
  );

  return (
    <div className="container mx-auto px-3 sm:px-4 py-20 sm:py-24 mb:py-32 max-w-4xl">
      {/* Profile Header */}
      <div className="mb-6 sm:mb-8">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback>
                  {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{profile?.full_name || 'User'}</h1>
                <p className="text-gray-600 text-sm sm:text-base truncate">{profile?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Profili Düzenle
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Edit Profile Section */}
      {isEditing && (
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Profili Düzenle</CardTitle>
            <CardDescription className="text-sm">Profil bilgilerinizi güncelleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                <AvatarImage src={editForm.avatar_url} alt="Profile" />
                <AvatarFallback>
                  {editForm.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                onClick={() => setShowAvatarDialog(true)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Avatarı Değiştir
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm">İsim ve Soyisim</Label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                placeholder="İsim ve Soyisim girin"
                className="text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={handleSaveProfile} disabled={saving} className="text-xs sm:text-sm">
                {saving ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                )}
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    full_name: profile?.full_name || '',
                    avatar_url: profile?.avatar_url || avatarOptions[0]
                  });
                }}
                disabled={saving}
                className="text-xs sm:text-sm"
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Avatar Selection Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="max-w-xs sm:max-w-2xl mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Avatarınızı Seçin</DialogTitle>
            <DialogDescription className="text-sm">
              Ücretsiz avatar koleksiyonumuzdan birini seçin
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-64 sm:h-96">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4">
              {avatarOptions.map((avatarUrl, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-1 sm:p-2 rounded-lg border-2 transition-colors ${
                    selectedAvatar === avatarUrl
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAvatarSelect(avatarUrl)}
                >
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Main Content Tabs */}
      <Tabs defaultValue="cart" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="cart" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 text-xs sm:text-sm">
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Sepet</span>
          </TabsTrigger>
          <TabsTrigger value="likes" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 text-xs sm:text-sm">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Beğeniler</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 text-xs sm:text-sm">
            <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Takip</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 text-xs sm:text-sm">
            <History className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Geçmiş</span>
          </TabsTrigger>
        </TabsList>

        {/* Cart Tab */}
        <TabsContent value="cart">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                <span>Sepetim</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Sepetinizdeki ürünler
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {cartOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {cartOrders.map((order) => (
                    <OrderCard key={order.id} order={order} showRemoveButton={true} />
                  ))}
                  <div className="mt-6 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Toplam Tutar:</span>
                      <span className="font-bold text-lg">
                        ${cartOrders.reduce((total, order) => total + order.total_price, 0).toFixed(2)}
                      </span>
                    </div>
                    <Link href={"/cart"} className="block">
                    <Button className="mt-4 w-full">Alışverişi Tamamla</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Sepetiniz boş</p>
                  <p className="text-xs sm:text-sm">Alışverişe başlayın ve ürünleri sepete ekleyin!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Liked Products Tab */}
        <TabsContent value="likes">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                <span>Beğenilen Ürünler</span>
              </CardTitle>
              <CardDescription className="text-sm">
                İlginizi çeken ürünler
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {likedProducts.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {likedProducts.map((product) => (
                  <LikedProductCard key={product.id} product={product} />
                ))}
              </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Henüz beğenilen ürün yok</p>
                  <p className="text-xs sm:text-sm">Keşfetmeye başlayın ve ilginizi çeken ürünleri beğenin!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders History Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span>Sipariş Geçmişi</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Tamamlanan ve teslim edilen siparişleriniz
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {deliveredOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {deliveredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Henüz teslim edilen sipariş yok</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>


        {/* Order Tracking Tab */}
        <TabsContent value="tracking">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <span>Sipariş Takibi</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Bekleyen ve devam eden siparişlerinizi takip edin
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {trackingOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {trackingOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Truck className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Henüz takip edilecek sipariş yok</p>
                  <p className="text-xs sm:text-sm">Aktif siparişleriniz burada görünecek!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}