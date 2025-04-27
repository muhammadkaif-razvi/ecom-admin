import { db } from "@/lib/db";
import { FragranceForm } from "./components/form";

interface fragranceProps {
  params: Promise<{ fragranceId: string }>;
}
const fragrancePages = async (props: fragranceProps) => {
  const { fragranceId } = await props.params;
  const fragrance = await db.fragrance.findUnique({
    where: {
      id: fragranceId,
    },
  });
  return (
    <div className="mt-8 flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <FragranceForm initialData={fragrance} />
      </div>
    </div>
  );
};
export default fragrancePages;
