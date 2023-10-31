import Route from "@components/Route";
import styles from "./RoutesComponent.module.css";
import { useEffect, useState } from "react";
import { getDataFromApi } from "src/utils/getDataFromApi";

function RoutesComponent({ id }) {
  const [rutas, setRoutes] = useState([]);
  const subtitles = [
    "Nombre",
    "Estilo",
    "Multilargo",
    "Grado",
    "Distancia",
    "Año",
    "Encadenada",
  ];

  useEffect(() => {
    getDataFromApi(`routes/search?sector=${id}`).then((data) => {
      setRoutes(data.body);
    });
  }, []);

  return (
    <>
      <div className={styles.container}>
        <ul className={styles.list}>
          <li className={styles.listHeader}>
            <div>Nro</div>
            <div className={styles.headerItem}>Nombre</div>
            <div className={styles.headerItem}>Estilo</div>
            <div className={styles.headerItem}>multilargo</div>
            <div className={styles.headerItem}>Grado</div>
            <div className={styles.headerItem}>Distancia</div>
            <div className={styles.headerItem}>Año</div>
            <div className={styles.headerItem}>Proyecto</div>
            <div className={styles.headerItem}>Encadenada</div>
          </li>
          {rutas?.map((ruta) => (
            <li key={ruta._id} className={styles.listItem}>
              <p className={styles.item}>{ruta["image_number"] || "0"}</p>
              <p className={`${styles.item} ${styles.itemName}`}>{ruta.name}</p>
              <p className={styles.item}>{ruta.style}</p>
              <p className={styles.item}>
                Multilargo {ruta["is_multipicth"] ? "✔" : "❌"}
              </p>
              <p className={styles.item}>
                {ruta.grade["french"]}/{ruta.grade["usa"]}
              </p>
              <p className={styles.item}>{ruta.distance}</p>
              <p className={styles.item}>{ruta["year_opened"]}</p>
              <p className={styles.item}>{ruta["route_developer"]}</p>
              <p className={styles.item}>{ruta["is_proyect"] ? "✔" : "❌"}</p>
              <input
                className={styles.item}
                checked={ruta["is_done"]}
                type='checkbox'
              ></input>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default RoutesComponent;
