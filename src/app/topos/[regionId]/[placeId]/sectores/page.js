import Link from "next/link";
import { Suspense } from "react";
import OptionsTopoToRender from "src/app/topos/components/OptionsTopoToRender";
import SectorsToRender from "src/app/topos/components/SectorsToRender";
import { getAllRoutes, getSectorsByPlaceId, getRegionById, getAllPlaces } from "../../../fetchData";

import styles from "./SectorsPage.module.css";

export default async function SectorPage({ params }) {
  const { placeId, regionId } = await params;
  
  // Obtener los datos necesarios
  const routes = await getAllRoutes();
  const sectors = await getSectorsByPlaceId(placeId);
  
  // Obtener datos de la región para el breadcrumb
  const regionData = await getRegionById(regionId);
  const regionName = regionData?.[0]?.name || regionId;
  
  // Obtener datos del lugar para el breadcrumb
  const places = await getAllPlaces();
  const place = places.find(p => p.id === placeId);
  const placeName = place?.name || placeId;
  

  
  return (
    <>
      <Suspense fallback={<p>Cargando sectores...</p>}>
        <div className={styles.container}>
          <Link href={`/topos/${regionId}/${placeId}`}>
            <OptionsTopoToRender name='Ver Información' />
          </Link>
          <div>
            {sectors.map((sector) => (
              <SectorsToRender key={sector.id} routes={routes} sector={sector} />
            ))}
          </div>
        </div>
      </Suspense>
    </>
  );
}
