import { db } from "@/lib/db";
import { format } from "date-fns";
import { VariantClient } from "./components/client";
import { variantColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
const variantsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const variants = await db.variant.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      images: true,
      product: true,
      ingredients: true, 
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedvariants: variantColumn[] = variants.map((item) => ({
    images: item.images.map((image) => image.url),
    id: item.id,
    name: item.name,
    quantity: item?.variantsepQuant ? String(item.variantsepQuant) : "0",
    price: formatter.format(item.price?.toNumber() || 0),
    stock: String(item?.inventory ?? "N/A"),
    productname: item.product?.name || "Unknown Product",
    ingredients: item.ingredients.map((ingredient) => ingredient.name),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 pt-6">
        <VariantClient data={formattedvariants} />
      </div>
    </div>
  );
};

export default variantsPage;
