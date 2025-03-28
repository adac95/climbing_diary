import Link from "next/link";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "../../components/PlaceToRender";
import { getAllPlaces, getCachedPlaces } from "../../../../utils/fetchData";
import { Suspense } from "react";
import styles from "./PlacePage.module.css";

export default async function PlacePage({ params }) {
  const places = await getCachedPlaces();
  const { regionId, placeId } = await params;
  const place = places.find((p) => p.id === placeId);

  return (
    <Suspense fallback={<p>Cargando place...</p>}>
      <div className={styles.container}>
        <Link href={`/topos/${regionId}/${placeId}/sectores`}>
          <OptionsTopoToRender name='Ver sectores' />
        </Link>
        <PlaceToRender place={place} />
      </div>
    </Suspense>
  );
}
