import { db } from "@/lib/db";
import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
const ProductsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const products = await db.product.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      category: true,
      images: true,
      variants: true, // Include variants in the query
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    images: item.images.map((image) => image.url),
    name: item.name,
    description: item.description,

    variantName: item?.variants.map((variant) => variant.name).join(", "),
    variantPrice: item?.variants
      .map((variant) => formatter.format(variant.price.toNumber() || 0))
      .join(", "),
    variantQuantity: item?.variants
      .map((variant) => variant.variantsepQuant)
      .join(", "),
    hasVariants: item.variants.length > 0,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    isNewLaunch: item.isNewlaunch,
    isBestseller: item.isBestseller,
    category: item.category.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
