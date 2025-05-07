"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  images: string[];
  name: string;
  description: string;
  category: string;
  hasVariants: boolean;
  isFeatured: boolean;
  isArchived: boolean;
  isNewLaunch: boolean;
  isBestseller: boolean;
  variantName: string;
  variantPrice: string;
  variantQuantity: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.images[0];
      return (
        <img
          src={imageUrl}
          alt="Image"
          className="h-12 w-12 object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div style={{ minWidth: '200px' }}>Name</div>,
    cell: ({ row }) => (
      <div style={{ minWidth: '200px' }}>
        {row.getValue("name")}
      </div>
    ),
  }
  ,
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      const words = desc.split(" ");
      const shortDesc = words.length > 10 ? words.slice(0, 10).join(" ") + "..." : desc;
      return (
        <div className="min-w-[200px]">{shortDesc}</div>
      );
    }
  }
  ,
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "hasVariants",
    header: "Has Variants",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isNewLaunch",
    header: "New Launch",
  },
  {
    accessorKey: "isBestseller",
    header: "Best Seller",
  },
  {
    accessorKey: "variantName",
    header: "Variant Name",
    cell: ({ row }) => {
      const variantNames = row.original.variantName.split(",");
      return (
        <div className="flex flex-wrap gap-1 min-w-[200px] ">
          {variantNames.map((variantName, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
            >
              {variantName}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "variantPrice",
    header: "Variant Price",
    cell: ({ row }) => {
      const variantNames = row.original.variantPrice.split(",");
      return (
        <div className="flex flex-wrap gap-1 min-w-[50px] ">
          {variantNames.map((variantName, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
            >
              {variantName}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "variantQuantity",
    header: "Variant Quantity",
    cell: ({ row }) => {
      const variantNames = row.original.variantQuantity.split(",");
      return (
        <div className="flex flex-wrap gap-1 min-w-[110px] ">
          {variantNames.map((variantName, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
            >
              {variantName}
            </span>
          ))}
        </div>
      );
    },
  },

  // {
  //   accessorKey: "color",
  //   header: "Color",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex items-center gap-x-2">
  //         {row.original.color}
  //         <div
  //           className="h-6 w-6 rounded-full border"
  //           style={{ backgroundColor: row.original.color }}
  //         />
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <div className="min-w-[100px]">{row.getValue("createdAt")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
