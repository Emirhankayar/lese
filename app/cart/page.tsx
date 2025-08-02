import CheckoutPage from '@/components/layout/sections/checkout';
import { cartMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = cartMetadata;
export default function CheckoutRoute() {
  return (
    <>

      <CheckoutPage />
    
    
    </>
  );
}