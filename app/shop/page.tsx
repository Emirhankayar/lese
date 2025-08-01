import { FooterSection } from "@/components/layout/sections/footer";
import { ProductSection } from "@/components/layout/sections/product";
export const metadata = {
  title: "LESE - Metalcraft",
  description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
  openGraph: {
    type: "website",
    url: "https://github.com/emirhankayar/lese",
    title: "LESE - Metalcraft",
    description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "LESE - Metalcraft",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/emirhankayar/lese",
    title: "LESE - Metalcraft",
    description: "LESE Metalcraft Ltd. Şti. – Hassas Metal İşleme ve Üretim",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
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
