"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: { url: string }) => void;
  onRemove: (url: string | undefined) => void;
  value: { url: string }[];
  maxFiles?: number;
  single?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value = [],
  maxFiles = 6,
  single = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    const secureUrl = result?.info?.secure_url;
    if (secureUrl) {
      // Call onChange with full array for multiple images
      if (!single) {
        onChange({ url: secureUrl }); // Will be handled in parent
      } else {
        // Replace if single
        onRemove(value[0]?.url);
        onChange({ url: secureUrl });
      }
    }
  };
  

  if (!isMounted) return null;

  const canUploadMore = single ? value.length === 0 : value.length < maxFiles;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((image) => (
          <div
            key={image.url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(image.url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Uploaded image"
              src={image.url}
            />
          </div>
        ))}
      </div>
      {canUploadMore && (
        <CldUploadWidget onUpload={onUpload} uploadPreset="sjiyx6o3">
          {({ open }) => {
            const handleClick = () => {
              if (single && value.length > 0) {
                onRemove(value[0].url);
              }
              open();
            };

            return (
              <Button
                type="button"
                disabled={disabled}
                variant="secondary"
                onClick={handleClick}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                {single
                  ? value.length
                    ? "Replace Image"
                    : "Upload Image"
                  : "Upload Image"}
              </Button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
};