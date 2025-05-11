import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ storeId: string; customerId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    const { storeId, customerId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!customerId) {
      return new NextResponse("Customer ID is required", { status: 400 });
    }

    // Check if the store belongs to the user
    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Fetch orders by customer ID and include order items with status
    const orders = await db.order.findMany({
      where: {
        storeId,
        customerId,
      },
      include: {
        orderItems: {
          include: {
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_BY_CUSTOMER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
