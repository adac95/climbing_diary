import Link from "next/link";
import OptionsTopoToRender from "src/app/topos/components/OptionsTopoToRender";
import SectorsToRender from "src/app/topos/components/SectorsToRender";
import { getAllRoutes, getSectorsByPlaceId } from "src/app/topos/fetchData";

export default async function SectorPage({ params }) {
  const routes = await getAllRoutes();
  const { placeId, regionId } = await params;
  const sector = await getSectorsByPlaceId(placeId);
  return (
    <>
      <Link href={`/topos/${regionId}/${placeId}`}>
        <OptionsTopoToRender name='ver Informacion' />
      </Link>
      <div>
        {sector.map((sector) => (
          <SectorsToRender key={sector.id} routes={routes} sector={sector} />
        ))}
      </div>
    </>
  );
}
