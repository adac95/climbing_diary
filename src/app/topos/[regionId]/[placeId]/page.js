import Link from "next/link";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "./PlaceToRender";
import { getAllPlaces } from "../../fetchData";
import styles from "./PlacePage.module.css";
import { notFound } from "next/navigation";

// ISR: Revalidar cada 24 horas
export const revalidate = 86400;

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
