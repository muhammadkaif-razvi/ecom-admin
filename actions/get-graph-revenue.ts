import { db } from "@/lib/db";

interface GraphData {
  name: string;
  total: number;
}

export async function getGraphRevenue(storeId: string): Promise<GraphData[]> {
  try {
    const paidOrders = await db.order.findMany({
      where: {
        storeId,
        isPaid: true,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                variants: {
                  select: {
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const graphData: GraphData[] = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    for (const order of paidOrders) {
      const month = order.createdAt.getMonth(); // 0 for Jan, 11 for Dec
      let orderTotal = 0;
      for (const item of order.orderItems) {
        if (item.product?.variants.length > 0) {
          // Still assuming we take the price of the first variant.
          // Ideally, you'd fetch the price from the specific variant
          // associated with the order item at the time of purchase.
          orderTotal += item.product.variants[0].price.toNumber();
        }
      }
      graphData[month].total += orderTotal;
    }

    return graphData;
  } catch (error) {
    console.error("Error getting graph revenue:", error);
    return [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];
  } finally {
    if (db.$disconnect) {
      await db.$disconnect();
    }
  }
}