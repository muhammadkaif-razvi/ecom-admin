"use client";

import { DeliveryStatus, Image as PrismaImage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { CellImage } from "./cell-image";
import { cn } from "@/lib/utils";
import { CellAction } from "./cell-action";


// Define row type
export type OrderColumn = {
  id: string;
  images: PrismaImage[];
  phone: string;
  email: string;
  address: string;
  isPaid: boolean;
  products: string[];
  totalPrice: string;
  createdAt: string;
  orderStatus: DeliveryStatus;
};


export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const imageUrl = row.original.images
      return (
        <div className="grid lg:grid-cols-2  sm:grid-cols-1 gap-2">
          <CellImage data={imageUrl} />
        </div>
      )

    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as string[];
      return (
        <div className="flex flex-col gap-1">
          {products.map((product, index) => (
            <span key={index} className="text-sm font-sans">{product}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => {
      const { isPaid } = row.original;
      return <p className={cn("text-sm", isPaid ? "text-emerald-500" : "text-red-500")}>{isPaid ? "Paid" : "Not Paid"}</p>
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
  
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
