"use client";

import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {  OrderColumn } from "./columns";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy,  Home, MoreHorizontal, Package, Trash, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/components/modals/alert-modal";



interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useParams();
  const { update } = useSession();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("order Id copied");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
      location.reload();
      update();
      toast.success(" order deleted.");
    } catch {
      toast.error(
        "Make sure you removed all products using this orders first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  const onUpdate = async (data: any) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, data);
      location.reload();
      update();
      toast.success(`order ${data.deliveryStatus} `);
    } catch {
      toast.error(
        "something went wrong."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={() => {
          onDelete();
        }}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuLabel
            onClick={() => {
              onCopy(data.id);
            }}
            className="flex flex-row items-center hover:bg-slate-400 cursor-pointer rounded-sm"
          >
            <Copy className=" mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuLabel>
          <DropdownMenuLabel
            onClick={() => onUpdate({ id: data.id, deliveryStatus: "Packed" })}
            className="flex flex-row items-center hover:bg-slate-400 cursor-pointer rounded-sm"
          >
            <Package className=" mr-2 h-4 w-4" />
            Packed
          </DropdownMenuLabel>
          <DropdownMenuLabel
            onClick={() => onUpdate({ id: data.id, deliveryStatus: "Shipped" })}
            className="flex flex-row items-center hover:bg-slate-400 cursor-pointer rounded-sm "
          >
            <Truck className=" mr-2 h-4 w-4" />
            Shipped
          </DropdownMenuLabel>
          <DropdownMenuLabel
            onClick={() => onUpdate({ id: data.id, deliveryStatus: "Delivered" })}
            className="flex flex-row items-center  hover:bg-slate-400 cursor-pointer  rounded-sm"
          >
            <Home className=" mr-2 h-4 w-4" />
            Delivered
          </DropdownMenuLabel>
          <DropdownMenuLabel
            onClick={() => {
              setOpen(true);
            }}
            className="flex flex-row items-center bg-red-300 rounded-sm cursor-pointer"
          >
            <Trash className=" mr-2 h-4 w-4" />
            Delete
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
