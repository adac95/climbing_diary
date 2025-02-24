import Link from "next/link";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "../../components/PlaceToRender";
import { getPlaceById } from "../../fetchData";
import styles from "./SectorPage.module.css";

export default async function PlacePage({ params }) {
  const { regionId, placeId } = await params;
  const place = await getPlaceById(placeId);
  return (
    <div className={styles.container}>
      PLACE
      <Link href={`/topos/${regionId}/${placeId}/sectores`}>
        <OptionsTopoToRender name='Ver sectores' />
      </Link>
      <PlaceToRender className={styles.buttons} place={place[0]} />
    </div>
  );
}
