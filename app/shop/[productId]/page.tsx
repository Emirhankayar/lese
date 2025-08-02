import ProductDetailSection from "@/components/layout/sections/productdetail";
import { FooterSection } from "@/components/layout/sections/footer";
import { supabase } from "@/lib/sbClient";
import { generateProductMetadata } from "@/lib/metadata";
export async function generateMetadata({ params }: { params: { productId: string } }) {
  
  try {
    const { data } = await supabase.rpc('get_product_with_details', {
      product_uuid: params.productId,
      user_uuid: null, 
      comments_limit: 0 
    });

    if (data?.product) {
      return generateProductMetadata(
        data.product.name,
        data.product.description,
        params.productId
      );
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
  }

  // Fallback 
  return generateProductMetadata(
    "Ürün Detayı",
    "LESE Metalcraft ürün sayfası",
    params.productId
  );
}
export default function ProductDetail() {


  return (
    <>
      <ProductDetailSection />
      <FooterSection />
    </>
  );
}