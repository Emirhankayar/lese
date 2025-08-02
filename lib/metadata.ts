// /auth page metadata
export const authMetadata = {
  title: "Giriş Yap - LESE Metalcraft",
  description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com/auth",
    title: "Giriş Yap - LESE Metalcraft",
    description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
    images: [
      {
        url: "https://www.lesemetalcraft.com/favicon-32z32.png",
        width: 1200,
        height: 630,
        alt: "LESE Metalcraft - Giriş",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://lesemetalcraft.com",
    title: "Giriş Yap - LESE Metalcraft",
    description: "LESE Metalcraft hesabınıza giriş yapın. Özel fiyatlar ve hızlı sipariş imkanlarından yararlanın.",
    images: [
      "https://www.lesemetalcraft.com/favicon-32z32.png",
    ],
  },
};

// /profile page metadata
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
        url: "https://www.lesemetalcraft.com/favicon-32z32.png",
        width: 1200,
        height: 630,
        alt: "LESE Metalcraft - Profil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://lesemetalcraft.com",
    title: "Profilim - LESE Metalcraft",
    description: "LESE Metalcraft profil sayfanız. Hesap bilgilerinizi güncelleyin, sipariş geçmişinizi görüntüleyin.",
    images: [
      "https://www.lesemetalcraft.com/favicon-32z32.png",
    ],
  },
};

// /shop page metadata
export const shopMetadata = {
  title: "Mağaza - LESE Metalcraft",
  description: "LESE Metalcraft ürün kataloğu. Hassas metal işleme parçaları, özel üretim çözümleri ve endüstriyel ürünler.",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com/shop",
    title: "Mağaza - LESE Metalcraft",
    description: "LESE Metalcraft ürün kataloğu. Hassas metal işleme parçaları, özel üretim çözümleri ve endüstriyel ürünler.",
    images: [
      {
        url: "https://www.lesemetalcraft.com/favicon-32z32.png",
        width: 1200,
        height: 630,
        alt: "LESE Metalcraft - Mağaza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://lesemetalcraft.com",
    title: "Mağaza - LESE Metalcraft",
    description: "LESE Metalcraft ürün kataloğu. Hassas metal işleme parçaları, özel üretim çözümleri ve endüstriyel ürünler.",
    images: [
      "https://www.lesemetalcraft.com/favicon-32z32.png",
    ],
  },
};

// /cart page metadata
export const cartMetadata = {
  title: "Sepetim - LESE Metalcraft",
  description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
  openGraph: {
    type: "website",
    url: "https://lesemetalcraft.com/cart",
    title: "Sepetim - LESE Metalcraft",
    description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
    images: [
      {
        url: "https://www.lesemetalcraft.com/favicon-32z32.png",
        width: 1200,
        height: 630,
        alt: "LESE Metalcraft - Sepet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://lesemetalcraft.com",
    title: "Sepetim - LESE Metalcraft",
    description: "LESE Metalcraft alışveriş sepetiniz. Seçtiğiniz ürünleri gözden geçirin ve siparişinizi tamamlayın.",
    images: [
      "https://www.lesemetalcraft.com/favicon-32z32.png",
    ],
  },
};

// /shop/[productId] dynamic page metadata generator function
export const generateProductMetadata = (productName: string, productDescription: string, productId: string) => ({
  title: `${productName} - LESE Metalcraft`,
  description: `${productDescription} | LESE Metalcraft hassas metal işleme ürünleri.`,
  openGraph: {
    type: "website",
    url: `https://lesemetalcraft.com/shop/${productId}`,
    title: `${productName} - LESE Metalcraft`,
    description: `${productDescription} | LESE Metalcraft hassas metal işleme ürünleri.`,
    images: [
      {
        url: "https://www.lesemetalcraft.com/favicon-32z32.png",
        width: 1200,
        height: 630,
        alt: `${productName} - LESE Metalcraft`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://lesemetalcraft.com",
    title: `${productName} - LESE Metalcraft`,
    description: `${productDescription} | LESE Metalcraft hassas metal işleme ürünleri.`,
    images: [
      "https://www.lesemetalcraft.com/favicon-32z32.png",
    ],
  },
});

// const productMetadata = generateProductMetadata(
//   "CNC Hassas Parça", 
//   "Yüksek kaliteli CNC ile işlenmiş hassas metal parça", 
//   "cnc-hassas-parca-001"
// );