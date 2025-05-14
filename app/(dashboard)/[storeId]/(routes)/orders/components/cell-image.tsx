"use client"

import { Image as PrismaImage } from "@prisma/client";
import Image from "next/image";

interface CellImageProps {
  data: PrismaImage[];
}

export const CellImage: React.FC<CellImageProps> = ({ data }) => {
  return (
    <>
      {data.map((pr, index) => (
        <div
          key={index}
          className="overflow-hidden w-10 h-10 min-w-10 aspect-square  lg:h-20 lg:w-16 relative" // Smaller on small screens
        >
          <Image
            alt="image"
            fill
            className="object-cover"
            src={pr.url}
          />
        </div>
      ))}
    </>
  );
};