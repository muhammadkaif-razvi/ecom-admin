"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: { url: string }[]) => void; // Changed onChange to expect an array
  onRemove: (url: string) => void; // Changed onRemove to expect the URL to remove
  value: { url: string }[];
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
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isWidgetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWidgetOpen]);

  const onUploadDebug = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      const secureUrl =
        typeof result.info === "object" ? result.info.secure_url : undefined;
      if (secureUrl) {
        console.log("Uploaded URL:", secureUrl);
        // Update to pass the new URL to the onChange prop as part of an array
        onChange([...value, { url: secureUrl }]);
      } else {
        console.error("Upload failed: secure_url is undefined");
      }
      setIsWidgetOpen(false); // Widget closed after successful upload
    },
    [onChange, setIsWidgetOpen, value]
  );

  const handleOpenWidget = useCallback(() => {
    setIsWidgetOpen(true);
  }, [setIsWidgetOpen]);

  const handleRemove = useCallback(
    (urlToRemove: string): void => {
      // Filter out the image to remove and call onRemove
      const updatedValue = value.filter((img) => img.url !== urlToRemove);
      onChange(updatedValue);
      onRemove(urlToRemove); // Optionally call the onRemove prop for external logic
    },
    [onChange, onRemove, value]
  );

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((image) => (
          <div
            key={image.url}
            className="relative w-[200px] h-[200px] rounded-md "
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => handleRemove(image.url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {image.url ? (
              <Image
                height={200}
                width={200}
                className="object-cover"
                alt="Uploaded image"
                src={image.url}
              />
            ) : null}
          </div>
        ))}
      </div>
      {value.length < maxFiles && (
        <CldUploadWidget
          onUpload={onUploadDebug}
          uploadPreset="sjiyx6o3"
          onOpen={handleOpenWidget} // Track when widget opens
          onClose={() => setIsWidgetOpen(false)} // Track when widget closes (if available)
        >
          {({ open }) => (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => open()}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
};