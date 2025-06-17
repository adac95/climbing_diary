import Link from "next/link";
import { Suspense } from "react";
import OptionsTopoToRender from "src/app/topos/components/OptionsTopoToRender";
import SectorViewWrapper from "@/app/topos/[regionId]/[placeId]/sectores/SectorsViewWrapper";
import { getAllRoutes, getSectorsByPlaceId } from "../../../fetchData";

import styles from "./SectorsPage.module.css";

export default async function SectorPage({ params, searchParams }) {
  const { placeId, regionId } = await params;

  // Obtener los datos necesarios
  const routes = await getAllRoutes();
  const sectors = await getSectorsByPlaceId(placeId);

  return (
    <>
      <Suspense fallback={<p>Cargando sectores...</p>}>
        <div className={styles.container}>
          <Link href={`/topos/${regionId}/${placeId}`}>
            <OptionsTopoToRender name='Ver Información' />
          </Link>
          <div>
            <SectorViewWrapper routes={routes} sectors={sectors} />
          </div>
        </div>
      </Suspense>
    </>
  );
}
