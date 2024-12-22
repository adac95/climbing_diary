import styles from "./PlaceToRender.module.css";

export function PlaceToRender({ place }) {
  console.log(place.lodge[0].price);
  return (
    <div className={styles.container} style={{ whiteSpace: "pre-line" }}>
      <h2 className={styles.tittle}>{place?.name}</h2>
      <span>
        <h3>Informacion</h3>
        <p>{place.information}</p>
      </span>
      <span>
        <h3>¿Cómo llegar?</h3>
        <p>{place.approach[0].information}</p>
        <h4>Transporte público:</h4>
        <p>{place.approach[0]["public_transport"]}</p>
        <h4>Transporte privado:</h4>
        <p>{place.approach[0]["private_transport"]}</p>
      </span>
      <span>
        <h3>Precios</h3>
        <p style={{ whiteSpace: "pre-line" }}>{place.price}</p>
      </span>
      <span>
        <h3>Zona de camping</h3>
        {place.camping[0]["is_available"] ? (
          <>
            <p>{place.camping[0].information}</p>
            <p>{place.camping[0].price}</p>
          </>
        ) : (
          <p>No disponible</p>
        )}
      </span>
      <span>
        <h3>Lodge/Hospedaje/Refugio</h3>
        {place.lodge[0]["is_available"] ? (
          <>
            <p>{place.lodge[0].information}</p>
            <p>{place.lodge[0].price}</p>
          </>
        ) : (
          <p>No disponible</p>
        )}
      </span>
      <span>
        <h3>Temporada</h3>
        <p>{place.season}</p>
      </span>
      <span>
        <h3>Reglas</h3>
        <p>{place.rules}</p>
      </span>
    </div>
  );
}
