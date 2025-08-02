import { FooterSection } from "@/components/layout/sections/footer";
import { ProductSection } from "@/components/layout/sections/product";
import { shopMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = shopMetadata;

export default function Shop() {
  return (
    <>
      <ProductSection/>
      <FooterSection />
    </>
  );
}
