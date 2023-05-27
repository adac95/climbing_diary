import SectorsToRender from "@components/SectosToRender";
import { setBtnToRender } from "@redux/reducers/toposReducer";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRegions } from "src/hooks/useRegions.hook";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "../../components/PlaceToRender";
import SelectTopoOption from "../../components/SelectTopoOption";
const optionsToRenderInTopo = ["info", "sectores", "apuntes"];
import { getDataFromApi } from "src/utils/getDataFromApi";
import RoutesComponent from "@components/RoutesComponent";

export default function Topos() {
  const { regions } = useRegions();

  // ----------- TODO: SEPARAR LOGICA PARA INPUTS Y RENDERS DE PLACES EN OTRO ARCHIVO ---------
  const [places, setPlaces] = useState();
  const [renderPlace, setRenderPlace] = useState();
  const [renderSectors, setRenderSectors] = useState();
  const btnToRender = useSelector((state) => state.topos.btnToRender);
  const dispatch = useDispatch();

  const getPlacesByRegion = useCallback(
    (regionInputId) => {
      getDataFromApi(`places/search?region=${regionInputId}`).then((data) => {
        setPlaces(data.body);
        setRenderPlace(null);
        dispatch(setBtnToRender(false));
      });
    },
    [dispatch]
  );

  const getSectorsByPlace = useCallback((placeInput) => {
    getDataFromApi(`places/${placeInput}`).then((data) => {
      setRenderPlace(data.body);
    });
    if (placeInput) {
      getDataFromApi(`sectors/search?place=${placeInput}`).then((data) => {
        setRenderSectors(data.body);
      });
    }
  }, []);

  const getSectorById = useCallback((plceId) => {
    getDataFromApi(`sectors/search?place=${plceId}`).then((data) => {
      setRenderSectors(data);
    });
  }, []);

  return (
    <div>
      <h3>Escoge el lugar</h3>
      <SelectTopoOption data={regions} inputToSet={getPlacesByRegion} />
      {places && (
        <SelectTopoOption data={places} inputToSet={getSectorsByPlace} />
      )}

      {/* MUESTRA LAS OPCIONES DE BOTONES */}

      {renderPlace &&
        optionsToRenderInTopo.map((e) => {
          return <OptionsTopoToRender name={e} key={e} />;
        })}

      {/* RENDERIZA LA INFORMACION SEGUN EL BOTON QUE ESCOJA */}

      {btnToRender.name === "info" && btnToRender.isActive && renderPlace && (
        <PlaceToRender place={renderPlace} />
      )}

      {btnToRender.name === "sectores" && btnToRender.isActive && (
        <>
          <h2>Sectores</h2>
          {renderSectors?.map((e) => (
            <SectorsToRender key={e._id} sectors={e} />
          ))}
        </>
      )}
    </div>
  );
}
