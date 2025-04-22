"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value = [],
  maxFiles = 6,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    const secureUrl = result?.info?.secure_url || (typeof result.info === "string" ? result.info : undefined);
    if (secureUrl) {
      onChange(secureUrl);
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {url ? (
              <Image
                height={200}
                width={200}
                className="object-cover"
                alt="Uploaded image"
                src={url}
              />
            ) : null}
          </div>
        ))}
      </div>
      {value.length < maxFiles && (
        <CldUploadWidget onUpload={onUpload} uploadPreset="sjiyx6o3">
          {({ open }) => {
            return (
              <Button
                type="button"
                disabled={disabled}
                variant="secondary"
                onClick={() => open()}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
};
