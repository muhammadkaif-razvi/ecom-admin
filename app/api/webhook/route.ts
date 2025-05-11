import { db } from "@/lib/db";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new Response(`Webhook Error: ${error}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (event.type === "checkout.session.completed") {
    const order = await db.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
      },
      include: {
        orderItems: true,
      },
    });

    const productVariantIds = order.orderItems.map((item) => item.variantId);

    await db.variant.updateMany({
      where: {
        id: {
          in: [...productVariantIds],
        },
      },
      data: {
        inventory: {
          decrement: 1,
        },
      },
    });
  }

  return new Response(null, { status: 200 });
}
