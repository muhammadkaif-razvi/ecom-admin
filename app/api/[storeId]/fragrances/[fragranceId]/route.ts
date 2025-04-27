import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ fragranceId: string }> }
) {
  try {
    const { fragranceId } = await params;

    if (!fragranceId) {
      return new NextResponse("fragrance id is required", { status: 400 });
    }

    const fragrance = await db.fragrance.findUnique({
      where: {
        id: fragranceId,
      },
    });
    return NextResponse.json(fragrance);
  } catch (error) {
    console.log("[fragrance_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; fragranceId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const { storeId } = await params;
    const { fragranceId } = await params;
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!fragranceId) {
      return new NextResponse("fragrance id is required", { status: 401 });
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

    const fragrance = await db.fragrance.updateMany({
      where: {
        id: fragranceId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(fragrance);
  } catch (error) {
    console.log("[fragrance_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ storeId: string; fragranceId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { storeId } = await params;
    const { fragranceId } = await params;

    if (!fragranceId) {
      return new NextResponse("fragrance  id is required", { status: 400 });
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

    const fragrance = await db.fragrance.deleteMany({
      where: {
        id: fragranceId,
      },
    });
    return NextResponse.json(fragrance);
  } catch (error) {
    console.log("[fragrance_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
