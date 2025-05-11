import { db } from "@/lib/db";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  let event: Stripe.Event; 

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return new Response(`Webhook Error: ${error}`, { status: 400 });
  }

  console.log("✅ Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    console.log("🛒 Metadata received:", session.metadata);

    if (!orderId) {
      console.error("❌ No orderId in session metadata");
      return new Response("Missing order ID", { status: 400 });
    }

    try {
      const order = await db.order.update({
        where: { id: orderId },
        data: { isPaid: true },
        include: { orderItems: true },
      });

      console.log("✅ Order marked as paid:", order.id);

      const productVariantIds = order.orderItems.map(
        (item) => item.variantId
      );

      const updateResult = await db.variant.updateMany({
        where: {
          id: {
            in: productVariantIds,
          },
        },
        data: {
          inventory: {
            decrement: 1,
          },
        },
      });

      console.log("✅ Inventory updated for variants:", productVariantIds);
      console.log("🛠 Update result:", updateResult);
    } catch (error) {
      console.error("❌ Error updating order or inventory:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
