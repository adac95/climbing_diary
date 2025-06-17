import RoutesComponent from "@/app/topos/[regionId]/[placeId]/sectores/RoutesComponent";
import Image from "next/image";

import styles from "./SectorsToRender.module.css";
import SectorInfo from "./SectorInfo";

export default function SectorsToRender({ sector, routes, isOpen, onToggle }) {
  const routesToRender = routes.filter((e) => e.sector_id == sector.id);

  return (
    <article className={styles.container}>
      <SectorInfo sector={sector} />
      {!isOpen ? (
        <>
          <Image
            className={styles.img}
            width={"300"}
            // fill
            height={"150"}
            alt='image of sector'
            src={
              "https://hcegmotvdidgavvacgcy.supabase.co/storage/v1/object/sign/topo_pictures/WhatsApp%20Image%202024-12-22%20at%2023.32.22.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMDBlNjhhMS1jNTFhLTRhNzAtOTZiYy01MWU3NDA4ZDJjMDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0b3BvX3BpY3R1cmVzL1DoYXJzdENhcHRpbWVzIEltYWdlIDIwMjQtMTItMjIgYXQgMjMuMzIuMjIuanBlZyIsImlhdCI6MTc0OTg0NzI1MywiZXhwIjoxNzgxMzgzMjUzfQ.IFddFI0yqYSEL2cebV_i6aVKvVwSUXsGzN3KbvtdvXA"
            }
          />
          <button
            className={
              isOpen ? `${styles.button} ${styles.buttonIsShow}` : styles.button
            }
            onClick={onToggle}
          >
            Ver Rutas
          </button>
        </>
      ) : (
        <>
          <div className={isOpen ? ` ${styles.imgIsShow}` :`` }>
            <Image
              className={styles.img}
              width={"300"}
              height={"150"}
              alt='image of sector'
              src={`https://hcegmotvdidgavvacgcy.supabase.co/storage/v1/object/sign/topo_pictures/WhatsApp%20Image%202024-12-22%20at%2023.32.22.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMDBlNjhhMS1jNTFhLTRhNzAtOTZiYy01MWU3NDA4ZDJjMDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0b3BvX3BpY3R1cmVzL1doYXRzQXBwIEltYWdlIDIwMjQtMTItMjIgYXQgMjMuMzIuMjIuanBlZyIsImlhdCI6MTc0OTg0NzI1MywiZXhwIjoxNzgxMzgzMjUzfQ.IFddFI0yqYSEL2cebV_i6aVKvVwSUXsGzN3KbvtdvXA`}
            />
            <button
              className={
                isOpen
                  ? `${styles.button} ${styles.buttonIsShow}`
                  : styles.button
              }
              onClick={onToggle}
            >
              Ocultar Rutas
            </button>
          </div>
          <RoutesComponent routes={routesToRender} />
        </>
      )}
    </article>
  );
}
