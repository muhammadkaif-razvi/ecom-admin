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
      return new NextResponse("name is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("images  is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Idis required", { status: 400 });
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

    const product = await db.product.create({
      data: {
        name,
        description,
        categoryId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
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
        isFeatured,
        isArchived,
        storeId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCTS_POST", error);

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
    const categoryId = searchParams.get("categoryId") || undefined;
    const faceId = searchParams.get("faceId") || undefined;
    const hairId = searchParams.get("hairId") || undefined;
    const makeupId = searchParams.get("makeupId") || undefined;
    const bodyId = searchParams.get("bodyId") || undefined;
    const comboId = searchParams.get("comboId") || undefined;
    const ingredientId = searchParams.get("ingredientId") || undefined;
    const fragranceId = searchParams.get("fragranceId") || undefined;
    const priceId = searchParams.get("priceId") || undefined;
    const isBestseller = searchParams.get("isBestseller");
    const isNewLaunch = searchParams.get("isNewLaunch");
    const isFeatured = searchParams.get("isFeatured");
    const isArchived = searchParams.get("isArchived");

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        storeId,
        categoryId,
        faceId,
        hairId,
        makeupId,
        bodyId,
        comboId,
        ingredientId,
        fragranceId,
        priceId,
        isNewlaunch: isNewLaunch ? true : undefined,
        isBestseller: isBestseller ? true : undefined,
        isArchived: isArchived ? true : undefined,
        isFeatured: isFeatured ? true : undefined,
      },
      include: {
        images: true,
        category: true,
        face: true,
        hair: true,
        makeup: true,
        body: true,
        combos: true,
        ingredient: true,
        fragrance: true,
        variants: {
          include: {
            images: true,
            ingredients: true,
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("PRODUCTS_GET", error);
    return new NextResponse("Database Error", { status: 500 });
  }
}
