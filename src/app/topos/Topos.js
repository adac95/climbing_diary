"use client";
import SectorsToRender from "@components/SectosToRender";
import { setBtnToRender } from "@redux/reducers/toposReducer";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "../../components/PlaceToRender";
import SelectTopoOption from "../../components/SelectTopoOption";
const optionsToRenderInTopo = ["info", "sectores", "apuntes"];
import styles from "./styles.module.css";

export default function Topos({ regions, places, sectors, routes }) {
  // ----------- TODO: SEPARAR LOGICA PARA INPUTS Y RENDERS DE PLACES EN OTRO ARCHIVO ---------
  const [regionId, setRegionId] = useState();
  const [placeId, setPlaceId] = useState();
  const [placesToRender, setPlacesToRender] = useState();
  const [sectorsToRender, setSectorsToRender] = useState();
  const btnToRender = useSelector((state) => state.topos.btnToRender);
  const dispatch = useDispatch();

  const getPlacesByRegionIdSelected = useCallback(
    (regionInputId) => {
      setRegionId(regionInputId);
      const placesToRenderByRegionId = places.filter(
        (e) => e.region_id.id == regionInputId
      );
      setPlacesToRender(placesToRenderByRegionId);
      setSectorsToRender(null);
      setPlaceId(null);
      dispatch(setBtnToRender(false));
    },
    [dispatch]
  );

  const getSectorsByPlaceIdSelected = useCallback((placeInputId) => {
    setPlaceId(placeInputId);
    const sectorsToRenderByPlaceId = sectors.filter(
      (e) => e.place_id == placeInputId
    );
    setSectorsToRender(sectorsToRenderByPlaceId);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Escoge el lugar</h3>
      <section className={styles.options}>
        <SelectTopoOption
          data={regions}
          inputToSet={getPlacesByRegionIdSelected}
        />
        {regionId && regionId != "undefined" && (
          <SelectTopoOption
            data={placesToRender}
            inputToSet={getSectorsByPlaceIdSelected}
          />
        )}
      </section>
      {/* MUESTRA LAS OPCIONES DE BOTONES */}
      <section className={styles.buttons}>
        {sectorsToRender &&
          placeId != "undefined" &&
          optionsToRenderInTopo.map((e) => {
            return (
              <OptionsTopoToRender className={styles.button} name={e} key={e} />
            );
          })}
      </section>
      {/* RENDERIZA LA INFORMACION SEGUN EL BOTON QUE ESCOJA */}

      {btnToRender.name === "info" &&
        btnToRender.isActive &&
        placeId &&
        placeId != "undefined" && (
          <PlaceToRender place={placesToRender.find((e) => e.id == placeId)} />
        )}

      {btnToRender.name === "sectores" &&
        placeId != "undefined" &&
        btnToRender.isActive &&
        sectorsToRender && (
          <section className={styles.sectors}>
            <h2 className={styles.tittle}>Sectores</h2>
            {sectorsToRender?.map((e) => (
              <SectorsToRender routes={routes} key={e.id} sector={e} />
            ))}
          </section>
        )}
    </div>
  );
}
