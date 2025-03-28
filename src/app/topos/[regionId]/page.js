// 'use cache'
import { Suspense, use } from "react";
import { getAllRegions, getCachedRegions, getRegionById } from "../../../utils/fetchData";

export default async function RegionPage({ params }) {
  const regions = await getCachedRegions();
  const { regionId } = await params;
  // const region = await getRegionById(regionId)
  const region = regions.find((p) => p.id === regionId);

  if (!region || region.length === 0) {
    return <p>Región no encontrada.</p>;
  }

  const { name, information, obs } = region;

  return (
    <Suspense fallback={<p>Cargando REGION...</p>}>
      <div>
        REGION
        <h2>{name}</h2>
        <p>{regionId}</p>
        <p>{obs}</p>
      </div>
    </Suspense>
  );
}
