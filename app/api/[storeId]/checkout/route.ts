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
  const { variantIds, quantities,id, name, email, phone } = await req.json();

 if (!storeId) {
    return new NextResponse("Store Id is required", { status: 400 });
  }
  if(!id){
    return new NextResponse("Customer Id is required", { status: 400 });
  }
  if(!name || !email || !phone ){
    return new NextResponse("Customer details is required", { status: 400 });
  }

  if (!variantIds || !Array.isArray(variantIds) || variantIds.length === 0) {
    return new NextResponse("Variant IDs are required", { status: 400 });
  }

  if (!quantities || !Array.isArray(quantities) || quantities.length !== variantIds.length) {
    return new NextResponse("Quantities must match variant IDs", { status: 400 });
  }

 let customer = await db.customer.findFirst({
    where: { email },
  });

  if (!customer) {
    customer = await db.customer.create({
      data: {
        id,
        name,
        email,
        phone,
        address :"",
      },
    });
  }

  const variants = await db.variant.findMany({
    where: {
      id: {
        in: variantIds,
      },
    },
    include: {
      images: true,
    },
  });


  if (variants.length !== variantIds.length) {
    return new NextResponse("One or more variants not found", { status: 404 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItemsData: { variantId: string; quantity: number; }[] = [];

  variants.forEach((variant, index) => {
    const quantity = quantities[index];
    
    line_items.push({
      quantity,
      price_data: {
        currency: "INR",
        product_data: {
          images: [variant.images[0].url],
          name: `${variant.name}`,
          metadata: {
            variantId: variant.id,
          },
        },
        unit_amount: variant.price.toNumber() * 100,
      },
    });

    orderItemsData.push({
      variantId: variant.id,
      quantity,
    });
  });
  const order = await db.order.create({
    data: {
      storeId,
      isPaid: false,
      customerId: customer.id,
      email,
      phone,
      
      orderItems: {
        createMany: {
          data: orderItemsData,
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    customer_email: email,
  phone_number_collection: {
    enabled: phone,
  },
    mode: "payment",
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders,
  });
}
