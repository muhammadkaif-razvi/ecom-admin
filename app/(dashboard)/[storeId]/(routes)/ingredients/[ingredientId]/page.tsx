import { db } from "@/lib/db";
import { IngredientForm } from "./components/form";

interface ingredientProps {
  params: Promise<{ ingredientId: string }>;
}
const ingredientPage = async (props: ingredientProps) => {
  const { ingredientId } = await props.params;
  const ingredient = await db.ingredient.findUnique({
    where: {
      id: ingredientId,
      
    },
    include:{
      images: true,
    }
  });
  return (
    <div className="mt-8 flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <IngredientForm initialData={ingredient} />
      </div>
    </div>
  );
};
export default ingredientPage;
