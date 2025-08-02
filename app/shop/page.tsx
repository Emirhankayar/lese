import { FooterSection } from "@/components/layout/sections/footer";
import { ProductSection } from "@/components/layout/sections/product";
import { shopMetadata as metadata } from '@/lib/metadata';
export { metadata };


export default function Shop() {
  return (
    <>
      <ProductSection/>
      <FooterSection />
    </>
  );
}
