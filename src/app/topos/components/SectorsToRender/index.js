"use client";

import RoutesComponent from "src/app/topos/components/RoutesComponent";
import Image from "next/image";
import { useState } from "react";
import styles from "./SectorsToRender.module.css";
import SectorInfo from "./SectorInfo";

export default function SectorsToRender({ sector, routes }) {
  const [isShow, setIsShow] = useState(false);
  const routesToRender = routes.filter((e) => e.sector_id == sector.id);

  
  const handleRoutesBtnToggle = () => {
    setIsShow(!isShow);

  };

  return (
    <article className={styles.container}>
      <SectorInfo sector={sector} />
      {!isShow ? (
        <>
          <Image
            className={styles.img}
            width={"300"}
            // fill
            height={"150"}
            alt='image of sector'
            src={
              "https://hcegmotvdidgavvacgcy.supabase.co/storage/v1/object/sign/topo_pictures/WhatsApp%20Image%202024-12-22%20at%2023.32.22%20(1).jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0b3BvX3BpY3R1cmVzL1doYXRzQXBwIEltYWdlIDIwMjQtMTItMjIgYXQgMjMuMzIuMjIuanBlZyIsImlhdCI6MTczNTU5MzI3NSwiZXhwIjoxNzM4MTg1Mjc1fQ.Q6DE_DX6yMg04qDNR4lE-b9WK_nffcSc5LDLiIVWXoU&t=2024-12-30T21%3A13%3A33.365Z"
            }
          />
          <button
            className={
              isShow ? `${styles.button} ${styles.buttonIsShow}` : styles.button
            }
            onClick={handleRoutesBtnToggle}
          >
           Ver Rutas
          </button>
        </>
      ) : (
        <>
          <div className={isShow && ` ${styles.imgIsShow}`}>
            <Image
              className={
                 styles.img
              }
              width={"300"}
              height={"150"}
              alt='image of sector'
              src={`https://hcegmotvdidgavvacgcy.supabase.co/storage/v1/object/sign/topo_pictures/WhatsApp%20Image%202024-12-22%20at%2023.32.22.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0b3BvX3BpY3R1cmVzL1doYXRzQXBwIEltYWdlIDIwMjQtMTItMjIgYXQgMjMuMzIuMjIuanBlZyIsImlhdCI6MTczNTU5MzI3NSwiZXhwIjoxNzM4MTg1Mjc1fQ.Q6DE_DX6yMg04qDNR4lE-b9WK_nffcSc5LDLiIVWXoU&t=2024-12-30T21%3A14%3A35.183Z`}
            />
            <button
              className={
                isShow
                  ? `${styles.button} ${styles.buttonIsShow}`
                  : styles.button
              }
              onClick={handleRoutesBtnToggle}
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
