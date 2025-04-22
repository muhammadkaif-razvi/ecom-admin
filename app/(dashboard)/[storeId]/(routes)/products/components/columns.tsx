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
  variantPrice:  string;
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
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
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
  },
  {
    accessorKey: "variantPrice",
    header: "Variant Price",
  },
  {
    accessorKey: "variantQuantity",
    header: "Variant Quantity",
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
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
