import RoutesComponent from "@components/RoutesComponent";
import Image from "next/image";
import { useState } from "react";
import { API_URL } from "variables";
import styles from "./SectorsToRender.module.css";

export default function SectorsToRender({ sector }) {
  const [isShow, setIsShow] = useState(false);
  const { name, aproach, style, _id } = sector;
  const handleRoutes = () => {
    setIsShow(!isShow);
  };
  return (
    <article className={styles.container}>
      <div className={styles.data}>
        <h3>{name}</h3>
        <h4>Aproach</h4>
        <p>{aproach}</p>
        <h4>Estilos de escalada</h4>
        <p>{style.map((e) => `[${e} ]`)}</p>
        <h4>Cantida de rutas</h4>
      </div>
      {!isShow && (
        <Image
          className={styles.img}
          width={"300"}
          // fill
          height={"150"}
          alt='image of sector'
          // src={`${API_URL}/${sector["image_with_routes"].path}`}
          src={`https://source.unsplash.com/random/?mountain/${_id}/300x150`}
        />
      )}
      <button
        className={
          isShow ? `${styles.button} ${styles.buttonIsShow}` : styles.button
        }
        onClick={handleRoutes}
      >
        Ver Rutas
      </button>
      {isShow && (
        <>
          <Image
            className={styles.img}
            width={"300"}
            height={"150"}
            alt='image of sector'
            src={`https://source.unsplash.com/random/?mountain/${_id}/300x150`}

            // src={`${API_URL}/${sector["image_with_routes"].path}`}
          />
          <RoutesComponent id={_id} />
        </>
      )}
    </article>
  );
}
