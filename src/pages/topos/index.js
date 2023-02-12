import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "variables";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "../../components/PlaceToRender";
import SelectTopoOption from "../../components/SelectTopoOption";
const optionsToRenderInTopo = ["info", "sectores", "apuntes"];

export default function Topos() {
  const getDataFromApi = async (search) => {
    const res = await fetch(`${API_URL}/api/${search}`);
    const data = await res.json();
    return data;
  };

  // ----------- TODO: SEPARAR LOGICA PARA INPUTS Y RENDERS DE PLACES EN OTRO ARCHIVO ---------
  const [regions, setRegions] = useState([]);
  const [regionInput, setRegionInput] = useState("");
  const [placeInput, setPlaceInput] = useState();
  const [places, setPlaces] = useState();
  const [renderPlace, setRenderPlace] = useState();
  const [renderSectors, setRenderSectors] = useState();
  const btnToRender = useSelector((state) => state.topos.btnToRender);

  useEffect(() => {
    getDataFromApi("regions").then((data) => {
      setRegions(data.body);
    });
  }, []);

  useEffect(() => {
    getDataFromApi(`places/search?region=${regionInput}`).then((data) => {
      setPlaces(data.body);
      setPlaceInput(null);
    });
  }, [regionInput]);

  useEffect(() => {
    getDataFromApi(`places/${placeInput}`).then((data) => {
      setRenderPlace(data.body);
    });
    if(placeInput){
      getDataFromApi(`sectors/search?place=${placeInput}`).then((data) => {setRenderSectors(data.body); console.log(data)});
    }
  }, [placeInput]);

  //  --------------------FIN DE TODO------------------------------------------

  // TODO : SEPARAR LO NECESARIO PARA RENDER SECTORES

  // useEffect(() => {
  //   console.log(placeInput)
  //   if (btnToRender.name === "sectores") {
  //     getDataFromApi(`sectors/search?place=${placeInput}`).then((data) => {setRenderSectors(data); console.log(data)});
  //   }
  //   return
  // }, []);

  return (
    <div>
      <h3>Escoge el lugar</h3>
      <SelectTopoOption data={regions} inputToSet={setRegionInput} />
      {places && <SelectTopoOption data={places} inputToSet={setPlaceInput} />}
      {renderPlace &&
        optionsToRenderInTopo.map((e) => {
          return <OptionsTopoToRender name={e} key={e} />;
        })}
      {btnToRender.name === "info" && btnToRender.isActive && (
        <PlaceToRender place={renderPlace} />
      )}
      {btnToRender.name === "sectores" && btnToRender.isActive && (
        <>
        <h3>Sectoresss</h3>
        <h4>{renderSectors[0]?.name}</h4>

        </>
      )}
    </div>
  );
}
