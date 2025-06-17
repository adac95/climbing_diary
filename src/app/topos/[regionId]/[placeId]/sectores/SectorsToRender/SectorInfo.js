import styles from "./SectorInfo.module.css";

export default function SectorInfo({sector}) {
  return (
    <div className={styles.info}>
      <h3>{sector.name}</h3>
      <div className={styles.details}>
        <p>Approach: {sector.approach}</p>
        {/* <p>Estilos de escalada: {sector.sector_style}</p> */}
        <p>Cantidad de rutas: {sector.routeCount}</p>
      </div>
    </div>
  );
}
