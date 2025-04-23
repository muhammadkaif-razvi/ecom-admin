// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ImagePlus, Trash } from "lucide-react";
// import { CldUploadWidget } from "next-cloudinary";
// import Image from "next/image";

// interface ImageUploadProps {
//   disabled?: boolean;
//   onChange: (value: { url: string }) => void;
//   onRemove: (url: string | undefined) => void;
//   value: { url: string }[];
//   maxFiles?: number;
//   single?: boolean;
// }

// export const ImageUpload: React.FC<ImageUploadProps> = ({
//   disabled,
//   onChange,
//   onRemove,
//   value = [],
//   maxFiles = 6,
//   single = false,
// }) => {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const onUpload = (result) => {
//     const secureUrl = result?.info?.secure_url;
//     if (secureUrl) {
//       // Call onChange with full array for multiple images
//       if (!single) {
//         onChange({ url: secureUrl }); // Will be handled in parent
//       } else {
//         // Replace if single
//         onRemove(value[0]?.url);
//         onChange({ url: secureUrl });
//       }
//     }
//   };
  

//   if (!isMounted) return null;

//   const canUploadMore = single ? value.length === 0 : value.length < maxFiles;

//   return (
//     <div>
//       <div className="mb-4 flex items-center gap-4 flex-wrap">
//         {value.map((image) => (
//           <div
//             key={image.url}
//             className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
//           >
//             <div className="z-10 absolute top-2 right-2">
//               <Button
//                 type="button"
//                 onClick={() => onRemove(image.url)}
//                 variant="destructive"
//                 size="icon"
//                 disabled={disabled}
//               >
//                 <Trash className="h-4 w-4" />
//               </Button>
//             </div>
//             <Image
//               fill
//               className="object-cover"
//               alt="Uploaded image"
//               src={image.url}
//             />
//           </div>
//         ))}
//       </div>
//       {canUploadMore && (
//         <CldUploadWidget onUpload={onUpload} uploadPreset="sjiyx6o3">
//           {({ open }) => {
//             const handleClick = () => {
//               if (single && value.length > 0) {
//                 onRemove(value[0].url);
//               }
//               open();
//             };

//             return (
//               <Button
//                 type="button"
//                 disabled={disabled}
//                 variant="secondary"
//                 onClick={handleClick}
//               >
//                 <ImagePlus className="h-4 w-4 mr-2" />
//                 {single
//                   ? value.length
//                     ? "Replace Image"
//                     : "Upload Image"
//                   : "Upload Image"}
//               </Button>
//             );
//           }}
//         </CldUploadWidget>
//       )}
//     </div>
//   );
// };
"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
  
} from "next-cloudinary";

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
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Apply overflow: hidden when the widget is open
    if (isWidgetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // Revert to default
    }
    // Cleanup function to ensure overflow is reset on unmount
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
        onChange(secureUrl);
      } else {
        console.error("Upload failed: secure_url is undefined");
      }
      setIsWidgetOpen(false); // Widget closed after successful upload
    },
    [onChange, setIsWidgetOpen]
  );

  const handleOpenWidget = useCallback(() => {
    setIsWidgetOpen(true);
  }, [setIsWidgetOpen]);

  const handleRemove = (url: string): void => {
    onRemove(url); // Call onRemove callback when removing the image
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md ">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => handleRemove(url)}
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
                src={url} // Use dynamic src here
              />
            ) : null}
          </div>
        ))}
      </div>
      {value.length < maxFiles && (
        <CldUploadWidget
          onSuccess={onUploadDebug}
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
