"use client";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import Image from "next/image"; 
import leseicon from "../../icons/g14.svg";

interface brandingSlideProps {
  name: string;
}

const brandings: brandingSlideProps[] = [
  {
    name: "",
  },
  {
    name: "",
  },
  {
    name: "",
  },
  {
    name: "",
  },
  {
    name: "",
  },
  {
    name: "",
  },
  {
    name: "",
  },
];

export const BrandingSlideComponent = () => {
  return (
<section id="branding" className="max-w-[75%] mx-auto py-8">
      <div className="mx-auto">
        <Marquee
          className="gap-[3rem]"
          fade
          innerClassName="gap-[3rem]"
          pauseOnHover
        >{brandings.map(({ name }) => (
  <div
    key={name}
    className="flex items-center text-xl md:text-2xl font-medium"
  >
    <Image
      src={leseicon}
      alt={name}
      width={100}
      height={32}
      className="mr-2"
    />
    {name}
  </div>
))}
        </Marquee>
      </div>
    </section>
  );
};
