import RoutesComponent from "@components/RoutesComponent";
import Image from "next/image";
import { useState } from "react";
import { API_URL } from "variables";

export default function SectorsToRender({ sector }) {
  const [isShow, setIsShow] = useState(false);
  const { name, aproach, style, _id } = sector;
  const handleRoutes = () => {
    setIsShow(!isShow);
  };
  return (
    <>
      <h3>{name}</h3>
      <h4>Aproach</h4>
      <p>{aproach}</p>
      <h4>Estilos de escalada</h4>
      <p>{style.map((e) => `[${e} ]`)}</p>
      <h4>Cantida de rutas</h4>
      <button onClick={handleRoutes}>Ver Rutas</button>
      {isShow && (
        <>
          <Image
            width={"350"}
            height={"150"}
            alt='image of sector'
            src={`http://localhost:3001/${sector["image_with_routes"].path}`}
          />
          <RoutesComponent id={_id} />
        </>
      )}
    </>
  );
}
