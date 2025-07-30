import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
interface ProductProps {
  productId: string;
  productImage: string;
  productName: string;
  productPrice: string;
  productCategory: string[];
  productDescription: string[];
  productLink: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}
export const ProductSection = () => {
  const productList: ProductProps[] = [
    {
      productId: "1",
      productImage:       "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [        
        {
          name: "X",
          url: "https://x.com/leo_mirand4",
        },
      ],
    },
    {
      productId: "2",
      productImage:
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
        {
          name: "X",
          url: "https://x.com/leo_mirand4",
        },
      ],
    },
    {
      productId: "3",
      productImage:
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
        
      ],
    },
    {
      productId: "4",
      productImage:
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
        
        {
          name: "X",
          url: "https://x.com/leo_mirand4",
        },
      ],
    },
    {
      productId: "5",
      productImage:
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
      ],
    },
    {
      productId: "6",
      productImage:
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
        
      ],
    },
    {
      productId: "7",
      productImage:
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
        
        {
          name: "X",
          url: "https://x.com/leo_mirand4",
        },
      ],
    },
    {
      productId: "8",
      productImage:
      "https://plus.unsplash.com/premium_photo-1677612031058-e90a2a6c03ed?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "Ürün İsmi 1",
      productPrice: "- 25$",
      productCategory: ["Ürün kategorısı"],
      productDescription: ["This is a sample product description for the product."],
      productLink: [
        {
          name: "X",
          url: "https://x.com/leo_mirand4",
        },
      ],
    },
  ];
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "X":
        return <XIcon />;
    }
  };

  return (
    <section id="product" className="container lg:w-[75%] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Online-Sipariş
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Ürünler ve Hizmetler
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {productList.map(
          (
            { productImage, productName, productPrice, productCategory, productDescription, productId },
            index
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <Image
                    src={productImage}
                    alt=""
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6">
                  {productName}
                  <span className="text-primary ml-2">{productPrice}</span>
                </CardTitle>
              </CardHeader>
              {productCategory.map((position, index) => (
                <CardContent
                  key={index}
                  className={`pb-0 text-muted-foreground ${
                    index === productCategory.length - 1 && "pb-6"
                  }`}
                >
                  {position}
                  {index < productCategory.length - 1 && <span>,</span>}
                </CardContent>
              ))}
              {productDescription.map((desc, index) => (
                <CardContent 
                  key={index} 
                  className={`text-sm text-muted-foreground ${
                    index === productDescription.length - 1 && "pb-6"
                  }`}
                >
                  {desc}
                </CardContent>
              ))}
              <CardFooter className="space-x-4 mt-auto">
  <Link 
    href={`/shop/${productId}`} 
  >
    Satın Al
  </Link>
</CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
