import CheckoutPage from '@/components/layout/sections/checkout';
export const metadata = {
  title: "Sepetim - LESE Metalcraft",
  description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com/cart",
    title: "Sepetim - LESE Metalcraft",
    description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Sepet",
      },
    ],
  },
};


export default function CheckoutRoute() {
  return (
    <>

      <CheckoutPage />
    
    
    </>
  );
}