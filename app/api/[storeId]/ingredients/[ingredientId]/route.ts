import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ingredientId: string }> }
) {
  try {
    const { ingredientId } = await params;

    if (!ingredientId) {
      return new NextResponse("ingredient id is required", { status: 400 });
    }

    const ingredient = await db.ingredient.findUnique({
      where: {
        id: ingredientId,
      },
      include: {
        images: true,
      },
    });
    return NextResponse.json(ingredient);
  } catch (error) {
    console.log("[ingredient_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; ingredientId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const { storeId } = await params;
    const { ingredientId } = await params;
    const body = await req.json();
    const { name, image, description } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!image) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("description is required", { status: 400 });
    }

    if (!ingredientId) {
      return new NextResponse("ingredient id is required", { status: 400 });
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

    // Update ingredient
    const ingredient = await db.ingredient.update({
      where: { id: ingredientId },
      data: {
        name,
        description,
      },
    });

    // Handle images separately
    await db.image.deleteMany({
      where: {
        ingredientId,
      },
    });

    await db.image.createMany({
      data: image.map((img: { url: string }) => ({
        url: img.url,
        ingredientId,
      })),
    });

    return NextResponse.json(ingredient);
  } catch (error) {
    console.log("[ingredient_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ storeId: string; ingredientId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { storeId } = await params;
    const { ingredientId } = await params;

    if (!ingredientId) {
      return new NextResponse("ingredient id is required", { status: 400 });
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

    const ingredient = await db.ingredient.deleteMany({
      where: {
        id: ingredientId,
      },
    });
    return NextResponse.json(ingredient);
  } catch (error) {
    console.log("[ingredient_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
