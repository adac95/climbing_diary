import Link from "next/link";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "../../components/PlaceToRender";
import { getAllPlaces, getRegionById } from "../../fetchData";
import styles from "./PlacePage.module.css";
import { notFound } from "next/navigation";


// ISR: Revalidar cada 24 horas
export const revalidate = 86400;

// ⚙️ Generar rutas estáticas
// export async function generateStaticParams() {
//   const places = await getAllPlaces();

//   return places.map((place) => ({
//     regionId: place.region_id,
//     placeId: place.id,
//   }));
// }

// 🧠 Metadata dinámica por lugar
export async function generateMetadata({ params }) {
  const param = await params;
  const places = await getAllPlaces();
  const place = places.find((p) => p.id === param.placeId);

  return {
    title: `Topos de ${place?.name}` || "Lugar",
    description: place?.description || "Descripción del lugar",
  };
}

// 🧱 Página principal
export default async function PlacePage({ params }) {
  const { regionId, placeId } = await params;

  // Obtener datos del lugar actual
  const places = await getAllPlaces();
  const place = places.find((p) => p.id === placeId);

  // Obtener datos de la región para el breadcrumb
  const regionData = await getRegionById(regionId);
  const regionName = regionData?.[0]?.name || regionId;

  if (!place) return notFound(); // Usa el sistema de error 404 de Next.js



  return (
    <div className={styles.container}>
      <Link href={`/topos/${regionId}/${placeId}/sectores`}>
        <OptionsTopoToRender name='Ver sectores' style={{ width: "150%" }} />
      </Link>
      <PlaceToRender place={place} />
    </div>
  );
}
