"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {

  return (
    <>
      <div className=" mt-8 flex items-center justify-between">
        <Heading
          title={` Orders(${data.length})`}
          description="Manage Orders for your store"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="email" />{" "}
    </>
  );
};
