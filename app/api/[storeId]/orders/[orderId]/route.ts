import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";




export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    const { storeId, orderId } = params;
    const body = await req.json();
    const { deliveryStatus } = body;  // assuming "deliveryStatus" comes from the body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!deliveryStatus) {
      return new NextResponse("Delivery status is required", { status: 400 });
    }

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Validate if the store belongs to the logged-in user
    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update the status of the OrderItem(s)
    const updatedOrderItems = await db.orderItem.updateMany({
      where: {
        orderId: orderId,  // Update all order items of this order
      },
      data: {
        status: deliveryStatus, // Update the status
      },
    });

    return NextResponse.json(updatedOrderItems);
  } catch (error) {
    console.log("[ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
