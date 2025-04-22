import { db } from "@/lib/db";

export async function getStockCount(storeId: string): Promise<number> {
  try {
    const stockCount = await db.variant.aggregate({
      where: {
        storeId,
      },
      _sum: {
        inventory: true,
      },
    });

    return stockCount._sum.inventory || 0;
  } catch (error) {
    console.error("Error getting stock count:", error);
    return 0;
  } finally {
    if (db.$disconnect) {
      await db.$disconnect();
    }
  }
}

// export const getStockCount = async (storeId: string) => {
//   const salesCount = await db.product.count({
//     where: {
//       storeId,
//       isArchived : false
//     },
 
//   });
//  return salesCount;
// }
