import ProfilePage from "@/components/layout/sections/user-profile";
import { profileMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = profileMetadata;
export default function CheckoutRoute() {
  return <ProfilePage />;
}