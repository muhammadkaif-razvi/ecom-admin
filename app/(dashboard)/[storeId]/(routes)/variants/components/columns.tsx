"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type variantColumn = {
  id: string;
  images: string[];
  name:string;
  price:string;
  quantity:string;
  stock:string;
  productname:string;
  createdAt: string;
  ingredients: string[];
};

export const columns: ColumnDef<variantColumn>[] = [
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
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "productname",
    header: "Product",
  },
  {
    accessorKey: "ingredients",
    header: "Ingredients",
    cell: ({ row }) => {
      const ingredients = row.original.ingredients
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {ingredients.map((ingredient, index) => (
            <span 
              key={index}
              className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
            >
              {ingredient}
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
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
