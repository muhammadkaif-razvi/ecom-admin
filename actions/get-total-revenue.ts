import { db } from "@/lib/db";

export const getTotalRevenue = async (storeId: string) => {
  try {
    // 1. Retrieve all paid orders
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

    // 2. Iterate through paid orders and their order items
    for (const order of paidOrders) {
      for (const orderItem of order.orderItems) {
        if (orderItem.variant?.price) {
          // Directly using the price from the variant associated with the order item.
          totalRevenue += orderItem.variant.price.toNumber();
        }
      }
    }

    return { totalRevenue };
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    throw error;
  } finally {
    // Ensure the database connection is closed, if necessary for your db client
    if (db.$disconnect) {
      await db.$disconnect();
    }
  }
};
