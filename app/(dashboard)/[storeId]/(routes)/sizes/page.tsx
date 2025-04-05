import { db } from "@/lib/db";
import { format } from "date-fns";
import { SizesClient } from "./components/client";
import { SizeColumn } from "./components/columns";
const SizesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const sizes = await db.size.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
