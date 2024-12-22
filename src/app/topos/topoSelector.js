"use client";
import SectorsToRender from "src/app/topos/components/SectosToRender";
import {
  setBtnToRender,
  setPlaces,
  setRegions,
} from "@redux/reducers/toposReducer";
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OptionsTopoToRender from "../../components/OptionsTopoToRender";
import { PlaceToRender } from "./components/PlaceToRender";
import SelectTopoOption from "./components/SelectTopoOption";
const optionsToRenderInTopo = ["info", "sectores", "apuntes"];
import styles from "./styles.module.css";
import { useParams, useRouter } from "next/navigation";

export default function TopoSelector({ regions, places, sectors, routes }) {

  const [regionSelectedId, setRegionSelectedId] = useState();
  const [placeSelectedId, setPlaceSelectedId] = useState();
  const [placesFromDataBase, setPlacesToRender] = useState();
  const [sectorsFromDataBase, setSectorsToRender] = useState();
  const btnToRender = useSelector((state) => state.topos.btnToRender);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    dispatch(setRegions(regions));
    dispatch(setPlaces(regions));
  }, []);

  useEffect(() => {
    const { regionId, placeId } = params;
    if (regionId) {
      setRegionSelectedId(regionId);
      const placesToRenderByRegionId = places.filter(
        (e) => e.region_id.id == regionId
      );
      setPlacesToRender(placesToRenderByRegionId);
      if (placeId) {
        setPlaceSelectedId(placeId);
        const sectorsToRenderByPlaceId = sectors.filter(
          (e) => e.place_id == placeId
        );
        setSectorsToRender(sectorsToRenderByPlaceId);
      }
    }
  }, [params, places, sectors]);

  const getPlacesByRegionIdSelected = useCallback(
    (regionInputId) => {
      setRegionSelectedId(regionInputId);
      const placesToRenderByRegionId = places.filter(
        (e) => e.region_id.id == regionInputId
      );
      setPlacesToRender(placesToRenderByRegionId);
      setSectorsToRender(null);
      setPlaceSelectedId(null);
      dispatch(setBtnToRender(false));
      router.push(`/topos/${regionInputId}`);
    },
    [dispatch, places, router]
  );

  const getSectorsByPlaceIdSelected = useCallback(
    (placeInputId) => {
      setPlaceSelectedId(placeInputId);
      const sectorsToRenderByPlaceId = sectors.filter(
        (e) => e.place_id == placeInputId
      );
      setSectorsToRender(sectorsToRenderByPlaceId);
      router.push(`/topos/${regionSelectedId}/${placeInputId}`);
    },
    [regionSelectedId, sectors, router]
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Escoge el lugar</h3>
      <section className={styles.options}>
        <SelectTopoOption
          defaultValue={regionSelectedId || "undefined"}
          data={regions}
          inputToSet={getPlacesByRegionIdSelected}
        />
        {regionSelectedId && regionSelectedId != "undefined" && (
          <SelectTopoOption
            defaultValue={placeSelectedId || "undefined"}
            data={placesFromDataBase}
            inputToSet={getSectorsByPlaceIdSelected}
          />
        )}
      </section>
      {/* MUESTRA LAS OPCIONES DE BOTONES */}
      <section className={styles.buttons}>
        {sectorsFromDataBase &&
          placeSelectedId != "undefined" &&
          optionsToRenderInTopo.map((e) => {
            return (
              <OptionsTopoToRender className={styles.button} name={e} key={e} />
            );
          })}
      </section>
      {/* RENDERIZA LA INFORMACION SEGUN EL BOTON QUE ESCOJA */}

      {btnToRender.name === "info" &&
        btnToRender.isActive &&
        placeSelectedId &&
        placeSelectedId != "undefined" && (
          <PlaceToRender
            place={placesFromDataBase.find((e) => e.id == placeSelectedId)}
          />
        )}

      {btnToRender.name === "sectores" &&
        placeSelectedId != "undefined" &&
        btnToRender.isActive &&
        sectorsFromDataBase && (
          <section className={styles.sectors}>
            <h2 className={styles.tittle}>Sectores</h2>
            {sectorsFromDataBase?.map((e) => (
              <SectorsToRender routes={routes} key={e.id} sector={e} />
            ))}
          </section>
        )}
    </div>
  );
}
