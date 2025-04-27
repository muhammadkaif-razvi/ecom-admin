import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

 export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;
  const { productIds, variantIds, quantities } = await req.json();

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return new NextResponse("Product IDs are required", { status: 400 });
  }

  if (!variantIds || !Array.isArray(variantIds) || variantIds.length === 0) {
    return new NextResponse("Variant IDs are required", { status: 400 });
  }

  if (!quantities || !Array.isArray(quantities) || quantities.length === 0) {
    return new NextResponse("Quantities are required", { status: 400 });
  }

  if (productIds.length !== variantIds.length || productIds.length !== quantities.length) {
    return new NextResponse("Product IDs, Variant IDs, and Quantities arrays must have the same length", { status: 400 });
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const variants = await db.variant.findMany({
    where: {
      id: {
        in: variantIds,
      },
      productId: {
        in: productIds, // Ensure variant belongs to the product
      },
    },
  });

  if (products.length !== productIds.length || variants.length !== variantIds.length) {
    return new NextResponse("One or more products or variants not found", { status: 404 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItemsData: { productId: string; variantId: string; quantity: number }[] = [];

  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const variantId = variantIds[i];
    const quantity = quantities[i];

    const product = products.find((p) => p.id === productId);
    const variant = variants.find((v) => v.id === variantId && v.productId === productId);

    if (!product || !variant) {
      return new NextResponse(`Product or variant not found for productId: ${productId} and variantId: ${variantId}`, { status: 404 });
    }

    // Check inventory if applicable
    if (variant.inventory !== null && variant.inventory < quantity) {
      return new NextResponse(`Insufficient inventory for variant: ${variant.name}`, { status: 400 });
    }

    line_items.push({
      quantity: quantity,
      price_data: {
        currency: "INR",
        product_data: {
          name: `${product.name} - ${variant.name}`,
        },
        unit_amount: variant.price.toNumber() * 100,
      },
    });

    orderItemsData.push({
      productId: productId,
      variantId: variantId,
      quantity: quantity,
    });
  }

  const order = await db.order.create({
    data: {
      storeId,
      isPaid: false,
      orderItems: {
        create: orderItemsData.map((item) => ({
          product: {
            connect: {
              id: item.productId,
            },
          },
          variant: {
            connect: {
              id: item.variantId,
            },
          },
          quantity: item.quantity,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
}