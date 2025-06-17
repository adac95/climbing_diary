import { Suspense } from "react";
import { getRegionById } from "../fetchData";
import Link from "next/link";

import styles from "./RegionPage.module.css";

// 🧠 Metadata dinámica por lugar
export async function generateMetadata({ params }) {
  const param = await params;
  const { regionId } = await param;
  const region = await getRegionById(regionId);

  return {
    title: `Topos de ${region[0]?.name}` || "Lugar",
    description: region?.information || "Descripción del lugar",
  };
}

export default async function RegionPage({ params }) {
  const { regionId } = await params;
  const region = await getRegionById(regionId);

  if (!region || region.length === 0) {
    return <p>Región no encontrada.</p>;
  }

  const { name, information, obs } = region[0];

  return (
    <div className={styles.container}>
      <Suspense fallback={<p>Cargando región...</p>}>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{name}</h1>
          {information && (
            <div className={styles.description}>
              <h2 className={styles.sectionTitle}>Información</h2>
              <p>{information}</p>
            </div>
          )}
          {obs && (
            <div className={styles.description}>
              <h2 className={styles.sectionTitle}>Observaciones</h2>
              <p>{obs}</p>
            </div>
          )}
          <div>ID: {regionId}</div>
        </div>
      </Suspense>
    </div>
  );
}
