import { BenefitsSection } from "@/components/layout/sections/benefits";
import { ContactSection } from "@/components/layout/sections/contact";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";


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


export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <SponsorsSection /> */}
      <BenefitsSection />
      <FeaturesSection />
      {/* <ServicesSection /> */}
      {/* <TestimonialSection /> */}
      {/*<TeamSection />*/}

  
      <ContactSection />
      {/*<FAQSection />*/}
      <FooterSection />
    </>
  );
}
