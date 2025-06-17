import {
  getRegionById,
  getAllPlaces,
  getSectorById,
} from "../../../../fetchData";

import { notFound } from "next/navigation";
import styles from "./SectorDetailPage.module.css";

export default async function SectorDetailPage({ params }) {
  const { regionId, placeId, sectorId } = params;

  // Obtener todos los datos necesarios para la navegación
  const regionData = await getRegionById(regionId);
  const places = await getAllPlaces();
  const place = places.find((p) => p.id === placeId);
  const sector = await getSectorById(sectorId);

  // Si no existe alguno de los datos, mostrar 404
  if (!regionData || !place || !sector) {
    return notFound();
  }

  const sectorName = sector?.name || sectorId;

  return (
    <div className={styles.container}>
      <div className={styles.contentCard}>
        <h1 className={styles.title}>{sectorName}</h1>

        {sector.description && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Descripción</h2>
            <p className={styles.sectionContent}>{sector.description}</p>
          </div>
        )}

        <div className={styles.metaInfo}>ID del sector: {sectorId}</div>
      </div>
    </div>
  );
}
