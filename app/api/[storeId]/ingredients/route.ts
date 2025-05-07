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
    const { name, image, description } = body;

    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!image) {
      return new NextResponse("Image URL  is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Image URL  is required", { status: 400 });
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

    const ingredient = await db.ingredient.create({
      data: {
        name,
        images: {
          createMany: {
            data: image.map((img: { url: string }) => ({
              url: img.url,
            })),
          },
        },
        description,
        storeId,
      },
    });

    return NextResponse.json(ingredient);
  } catch (error) {
    console.log("ingredientS_POST", error);

    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const ingredients = await db.ingredient.findMany({
      where: {
        storeId,
      },
      include: {
        images: true,
      }
    });

    return NextResponse.json(ingredients);
  } catch (error) {
    console.log("ingredientS_GET", error);
    return new NextResponse("Database Error", { status: 500 });
  }
}
