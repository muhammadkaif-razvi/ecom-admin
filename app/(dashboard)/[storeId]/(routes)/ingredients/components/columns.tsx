"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ingredientColumn = {
  id: string;
  name: string;
  description: string;
  images: string[];
  createdAt: string;
};

export const columns: ColumnDef<ingredientColumn>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.images[0];

      return (
        imageUrl && (
          <img
            src={imageUrl}
            alt={row.original.name}
            className="h-11 w-11 rounded-full"
          />
        )
      );
      }
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
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
