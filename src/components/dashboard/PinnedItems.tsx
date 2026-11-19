import { connection } from "next/server";
import { Pin } from "lucide-react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ItemCard from "@/components/dashboard/ItemCard";
import { getPinnedItems } from "@/lib/db/items";

export default async function PinnedItems() {
  await connection();
  const items = await getPinnedItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <DashboardSection title="Pinned" icon={Pin}>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </DashboardSection>
  );
}
