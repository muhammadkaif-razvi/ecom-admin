import { db } from "@/lib/db";

 export const getTotalRevenue = async(
  storeId: string
) =>{
  try {
    // 1. Retrieve all paid orders
    const paidOrders = await db.order.findMany({
      where: {
        isPaid: true,
        storeId
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                variants: {
                  select: {
                    price: true,
                    id: true,
                  },
                },
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
        if (orderItem.product?.variants.length > 0) {
          // Still making the assumption to take the price of the first variant.
          // Remember the limitations discussed earlier about accurately
          // knowing which variant was ordered and its price at that time.
          totalRevenue += orderItem.product.variants[0].price.toNumber();
        }
      }
    }

    return { totalRevenue };
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    throw error;
  } finally {
    // Ensure the database connection is closed, if necessary for your db client
    if (db.$disconnect) {
      await db.$disconnect();
    }
  }
}

