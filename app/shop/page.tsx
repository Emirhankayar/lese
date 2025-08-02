import { FooterSection } from "@/components/layout/sections/footer";
import { ProductSection } from "@/components/layout/sections/product";
export const metadata = {
  title: "Mağaza - LESE Metalcraft",
  description: "LESE Metalcraft ürün kataloğu. Hassas metal işleme parçaları, özel üretim çözümleri ve endüstriyel ürünler.",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com/shop",
    title: "Mağaza - LESE Metalcraft",
    description: "LESE Metalcraft ürün kataloğu. Hassas metal işleme parçaları, özel üretim çözümleri ve endüstriyel ürünler.",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Mağaza",
      },
    ],
  },

};
export default function Shop() {
  return (
    <>
      <ProductSection/>
      <FooterSection />
    </>
  );
}
