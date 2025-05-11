"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";

// Define order status options
export const ORDER_STATUSES = ["Placed", "Packed", "Shipped", "Delivered"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

// Define row type
export type OrderColumn = {
  id: string;
  phone: string;
  email: string;
  address: string;
  isPaid: boolean;
  products: string[]; // ⬅ Changed from string to string[] for clarity
  totalPrice: string;
  createdAt: string;
  orderStatus: OrderStatus;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as string[];
      return (
        <div className="flex flex-col gap-1">
          {products.map((product, index) => (
            <span key={index}>• {product}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => {
      const currentStatus = row.getValue("orderStatus") as OrderStatus;
      const orderId = row.original.id;

      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;

        try {
          // Update the status on the backend
          await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderStatus: newStatus }),
          });

          // You can add a toast or re-fetch logic here if needed
        } catch (error) {
          console.error("Failed to update order status:", error);
        }
      };

      return (
        <select
          value={currentStatus}
          onChange={handleChange}
          className="text-sm border px-2 py-1 rounded bg-white"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
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
      return row.getValue("isPaid") ? "Yes" : "No";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
