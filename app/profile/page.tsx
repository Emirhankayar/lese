import ProfilePage from "@/components/layout/sections/user-profile";
export const profileMetadata = {
  title: "Profilim - LESE Metalcraft",
  description: "LESE Metalcraft profil sayfanız. Hesap bilgilerinizi güncelleyin, sipariş geçmişinizi görüntüleyin.",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com/profile",
    title: "Profilim - LESE Metalcraft",
    description: "LESE Metalcraft profil sayfanız. Hesap bilgilerinizi güncelleyin, sipariş geçmişinizi görüntüleyin.",
    images: [
      {
        url: "https://www.lesemetalcraft.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LESE Metalcraft - Profil",
      },
    ],
  },

};
export default function CheckoutRoute() {
  return <ProfilePage />;
}