import { db } from "@/lib/db";

export const getTotalRevenue = async (storeId: string) => {
  try {
    const paidOrders = await db.order.findMany({
      where: {
        isPaid: true,
        storeId,
      },
      include: {
        orderItems: {
          include: {
            variant: {
              select: {
                price: true,
                id: true,
              },
            },
          },
        },
      },
    });

    let totalRevenue = 0;

    for (const order of paidOrders) {
      for (const orderItem of order.orderItems) {
        // Access quantity directly from orderItem
        if (orderItem.variant?.price && orderItem.quantity) {
          totalRevenue += orderItem.variant.price.toNumber() * orderItem.quantity;
        }
      }
    }

    return { totalRevenue };
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    throw error;
  }
};