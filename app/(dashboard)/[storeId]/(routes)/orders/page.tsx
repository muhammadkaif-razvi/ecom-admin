// app/(dashboard)/[storeId]/(routes)/orders/page.tsx
import { db } from "@/lib/db";
import { format } from "date-fns";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrderPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const orders = await db.order.findMany({
    where: { storeId },
    include: {
      customer: true,
      orderItems: {
        include: {
          variant: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => {
    const itemStatuses = item.orderItems.map((orderItem) => orderItem.status);

    // Order-level status can be decided based on the item statuses, for example:
    const orderStatus = itemStatuses.includes("Placed")
      ? "Placed"
      : itemStatuses.includes("Packed")
        ? "Packed"
        : itemStatuses.includes("Shipped")
          ? "Shipped"
          : itemStatuses.includes("Delivered")
            ? "Delivered"
            : "Placed"; // Default fallback value

    return {


      id: item.id,
      image: item.orderItems[0]?.variant.images || [],
      email: item.customer.email,
      phone: item.customer.phone,
      address: item.customer.address,
      products: item.orderItems.map((orderItem) => orderItem.variant.name),
      itemStatuses: item.orderItems.map((orderItem) => orderItem.status), // Each item's status
      totalPrice: formatter.format(
        item.orderItems.reduce((total, orderItem) => {
          return total + Number(orderItem.variant.price) * orderItem.quantity;
        }, 0)
      ),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      orderStatus: orderStatus, // Order-level status
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrderPage;
