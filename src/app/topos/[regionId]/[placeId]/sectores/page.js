import Link from "next/link";
import { Suspense } from "react";
import OptionsTopoToRender from "src/app/topos/components/OptionsTopoToRender";
import SectorsToRender from "src/app/topos/components/SectorsToRender";
import { getAllRoutes, getSectorsByPlaceId } from "@utils/fetchData";
import styles from "./SectorPage.module.css"

export default async function SectorPage({ params }) {
  const routes = await getAllRoutes();
  const { placeId, regionId } = await params;
  const sector = await getSectorsByPlaceId(placeId);
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <div className={styles.container}>
        <Link href={`/topos/${regionId}/${placeId}`}>
          <OptionsTopoToRender name='ver Informacion' />
        </Link>
        <div>
          {sector.map((sector) => (
            <SectorsToRender key={sector.id} routes={routes} sector={sector} />
          ))}
        </div>
      </div>
    </Suspense>
  );
}
