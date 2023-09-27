import styles from "./PlaceToRender.module.css";

export function PlaceToRender({ place }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>{place.name}</h2>
      <span>
      <h3>Informacion</h3>
      <p>{place.aproach.info}</p>
      </span>
    <span>
      <h3>¿Cómo llegar?</h3>
      <h4>Transporte público:</h4>
      <p>{place.aproach["transporte publico"]}</p>
      <h4>Transporte privado:</h4>
      <p>{place.aproach["transporte privado"]}</p></span>
      <span>
      <h3>Precios</h3>
      <p>{place.price}</p>
      </span>
      <span>
      <h3>Zona de camping</h3>
      <p>{place.camping.price}</p>
      </span>
      <span>
      <h3>Lodge/Hospedaje</h3>
      <p>{place.lodge.price}</p>
      </span>
    </div>
  );
}
