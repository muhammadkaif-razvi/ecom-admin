import { db } from "@/lib/db";

interface GraphData {
  name: string;
  total: number;
}

// Function to get daily revenue
export async function getDailyRevenue(storeId: string): Promise<GraphData[]> {
  try {
    const paidOrders = await db.order.findMany({
      where: {
        storeId,
        isPaid: true,
      },
      include: {
        orderItems: {
          include: {
            variant: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    const dailyRevenue: Record<string, number> = {};

    for (const order of paidOrders) {
      const day = order.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      let orderTotal = 0;
      for (const item of order.orderItems) {
        if (item.variant?.price && item.quantity) {
          orderTotal += item.variant.price.toNumber() * item.quantity;
        }
      }
      dailyRevenue[day] = (dailyRevenue[day] || 0) + orderTotal;
    }

    const graphData: GraphData[] = Object.keys(dailyRevenue)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((day) => ({ name: day, total: dailyRevenue[day] }));

    return graphData;
  } catch (error) {
    console.error("Error getting daily revenue:", error);
    return [];
  } finally {
    if (db.$disconnect) {
      await db.$disconnect();
    }
  }
}

// Function to get weekly revenue
export async function getWeeklyRevenue(storeId: string): Promise<GraphData[]> {
  try {
    const paidOrders = await db.order.findMany({
      where: {
        storeId,
        isPaid: true,
      },
      include: {
        orderItems: {
          include: {
            variant: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

     const weeklyRevenue: Record<string, number> = {};
     const getWeekStartDate = (date: Date): Date => {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when week starts on Monday
      return new Date(date.setDate(diff));
    };

    for (const order of paidOrders) {
      const weekStartDate = getWeekStartDate(new Date(order.createdAt));
      const weekKey = weekStartDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      let orderTotal = 0;
      for (const item of order.orderItems) {
        if (item.variant?.price && item.quantity) {
          orderTotal += item.variant.price.toNumber() * item.quantity;
        }
      }
      weeklyRevenue[weekKey] = (weeklyRevenue[weekKey] || 0) + orderTotal;
    }

    const graphData: GraphData[] = Object.keys(weeklyRevenue)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((week) => ({ name: week, total: weeklyRevenue[week] }));

    return graphData;
  } catch (error) {
    console.error("Error getting weekly revenue:", error);
    return [];
  } finally {
    if (db.$disconnect) {
      await db.$disconnect();
    }
  }
}