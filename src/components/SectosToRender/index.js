import RoutesComponent from "@components/RoutesComponent";
import { useState } from "react";

export default function SectorsToRender({ sectors }) {
  const [isShow, setIsShow] = useState(false);
  const { name, aproach, style } = sectors;
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
      <button onClick={handleRoutes}>
        Ver Rutas
      </button>
      {isShow && <RoutesComponent />}
    </>
  );
}
