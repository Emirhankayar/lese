"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
              Metalde
            <h1>
<span className="text-transparent px-2 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text">
  Güven
</span>
ve
<span className="text-transparent px-2 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text">
  Kalite
</span>


              Odaklı Hizmetler
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {`Tüm metal ürünleriniz için özel tasarım çözümler sunuyoruz. Kalıptan vidaya, hassas üretim ve güvenilir kaliteyle.`}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow">
              <Link href="#contact">
                İletişime Geç
              </Link>        
              <ArrowDown className="size-5 ml-2 group-hover/arrow:translate-y-1 transition-transform" />
            </Button>


          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
        {/*
        <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src={
              theme === "light"
                ? "/hero-image-light.jpeg"
                : "/hero-image-dark.jpeg"
            }
            alt="dashboard"
          />

        */}  
        <video
  className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center border border-t-2 border-secondary border-t-primary/30"
  autoPlay
  muted
  loop
  playsInline
>
  <source
    src={theme === "light" ? "/hero.mp4" : "/hero.mp4"}
    type="video/mp4"
  />
  Tarayıcınızın video desteği yok.
</video>
          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
