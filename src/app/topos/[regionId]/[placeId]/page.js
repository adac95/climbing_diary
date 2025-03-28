import Link from "next/link";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "../../components/PlaceToRender";
import { getPlaceById } from "../../fetchData";
import { Suspense } from "react";
import styles from "./PlacePage.module.css";

export default async function PlacePage({ params }) {
  const { regionId, placeId } = await params;
const place = await getPlaceById(placeId);

  return (
    <Suspense fallback={<p>Cargando place...</p>}>
      <div className={styles.container}>
        <Link href={`/topos/${regionId}/${placeId}/sectores`}>
          <OptionsTopoToRender name='Ver sectores' />
        </Link>
        <PlaceToRender place={place[0]} />
      </div>
    </Suspense>
  );
}
