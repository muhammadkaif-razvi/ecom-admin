import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        variants: {
          include: {
            images: true,
            ingredients: true,
            product: true,
          },
        },
        face: true,
        hair: true,
        makeup: true,
        body: true,
        combos: true,
        ingredient: true,
        fragrance: true,
        price: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const { storeId } = await params;
    const { productId } = await params;
    const body = await req.json();
    const {
      name,

      description,

      images,
      categoryId,
      faceId,
      hairId,
      makeupId,
      bodyId,
      comboId,
      ingredientId,
      fragranceId,
      priceId,
      isNewlaunch,
      isBestseller,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("description is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("category Id  is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("images  is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("product id is required", { status: 400 });
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

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        categoryId,
        ...(faceId ? { faceId } : {}),
        ...(hairId ? { hairId } : {}),
        ...(makeupId ? { makeupId } : {}),
        ...(bodyId ? { bodyId } : {}),
        ...(comboId ? { comboId } : {}),
        ...(ingredientId ? { ingredientId } : {}),
        ...(fragranceId ? { fragranceId } : {}),
        ...(priceId ? { priceId } : {}),
        isNewlaunch,
        isBestseller,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });
    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { storeId } = await params;
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("product id is required", { status: 400 });
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

    const product = await db.product.deleteMany({
      where: {
        id: productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
