import { db } from "@/lib/db";
import { format } from "date-fns";
import { ingredientColumn } from "./components/columns";
import { IngredientClient } from "./components/client";
const ingredientsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const ingredients = await db.ingredient.findMany({
    where: {
      storeId: storeId,
    },
   include: {
      images: true, 
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedingredients: ingredientColumn[] = ingredients.map((item) => ({
    id: item.id,
    name: item.name,
    images: item.images.map((image) => image.url) ,
    description: item.description,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 pt-6">
        <IngredientClient data={formattedingredients} />
      </div>
    </div>
  );
};

export default ingredientsPage;
