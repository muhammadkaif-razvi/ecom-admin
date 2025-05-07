import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const { storeId } = await params;
    const body = await req.json();
    const {
      name,
      images,
      price,
      productId,
      variantsepQuant,
      inventory,
      ingredients,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("price is required", { status: 400 });
    }
    if (!variantsepQuant) {
      return new NextResponse("quantity is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("images  is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Idis required", { status: 400 });
    }
    if (!inventory) {
      return new NextResponse("inventory is required", { status: 400 });
    }
    if (!ingredients || !ingredients.length) {
      return new NextResponse("ingredients is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const variant = await db.variant.create({
      data: {
        name,
        price,
        variantsepQuant,
        inventory,
        productId,
        images: {
          create: images.map((image: { url: string }) => ({
            url: image.url,
            productId: productId,
          })),
        },
        ingredients: {
          connect: ingredients?.map((id: string) => ({ id })) || [],
        },

        storeId,
      },
    });
    return NextResponse.json(variant);
  } catch (error) {
    console.log("variantS_POST", error);

    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || undefined;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const variants = await db.variant.findMany({
      where: {
        storeId,
        productId,
      },
      include: {
        images: true,
        ingredients: {
          include: {
            images: true,
          },
        },
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.log("variantS_GET", error);
    return new NextResponse("Database Error", { status: 500 });
  }
}
