import AdminProducts from "@/components/layout/sections/admin-products";
import AdminOrders from "@/components/layout/sections/admin-orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CheckoutRoute() {
  return (
    <div className="container mx-auto py-32 px-24">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          <AdminProducts />
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
          <AdminOrders />
        </TabsContent>
        
      </Tabs>
    </div>
  );
}