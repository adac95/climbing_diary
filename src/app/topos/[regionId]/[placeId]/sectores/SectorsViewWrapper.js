'use client'
import { useRouter, useSearchParams } from "next/navigation";
import SectorsToRender from "./SectorsToRender";

export default function SectoresViewWrapper({
  sectors,
  routes,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const expandedSectorId = searchParams.get("expandedSector");

  const handleToggle = (sectorId) => {
    const current = searchParams.get("expandedSector");

    const newExpanded = current === sectorId ? null : sectorId;
    const newParams = new URLSearchParams(searchParams.toString());

    if (newExpanded) {
      newParams.set("expandedSector", newExpanded);
    } else {
      newParams.delete("expandedSector");
    }

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className='space-y-4'>
      {sectors.map((sector) => (
        <SectorsToRender
          key={sector.id}
          sector={sector}
          routes={routes}
          isOpen={expandedSectorId === sector.id}
          onToggle={() => handleToggle(sector.id)}
        />
      ))}
    </div>
  );
}
