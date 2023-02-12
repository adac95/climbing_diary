export function PlaceToRender({place}) {
  return (
    <div>
      <h2>{place.name}</h2>
      <h4>Informacion</h4>
      <p>{place.aproach.info}</p>
      <h4>¿Cómo llegar?</h4>
      <h5>Transporte público:</h5>
      <p>{place.aproach["transporte publico"]}</p>
      <h5>Transporte privado:</h5>
      <p>{place.aproach["transporte privado"]}</p>
      <h4>Precios</h4>
      <p>{place.price}</p>
      <h4>Zona de camping</h4>
      <p>{place.camping.price}</p>
      <h4>Lodge/Hospedaje</h4>
      <p>{place.lodge.price}</p>
    </div>
  );
}
