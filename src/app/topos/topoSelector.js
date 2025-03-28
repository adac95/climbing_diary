"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import SelectTopoOption from "./components/SelectTopoOption";
import styles from "./styles.module.css";
import { useParams, useRouter } from "next/navigation";
import { getAllRegions, getPlacesByRegionId } from "../../utils/fetchData";

export default function TopoSelector({ regions = {}, places = {} }) {
  const router = useRouter();
  const params = useParams();

  const { regionId, placeId } = params;
  const placesForRegion = places.filter((p) => p.region_id.id === regionId);

  const getPlacesByRegionIdSelected = (regionInputId) => {
    router.push(`/topos/${regionInputId}`);
  };

  const getSectorsByPlaceIdSelected = (placeInputId) => {
    router.push(`/topos/${regionId}/${placeInputId}`);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Escoge el lugar</h3>
      <section className={styles.options}>
        <SelectTopoOption
          defaultValue={regionId || "undefined"}
          data={regions}
          inputToSet={getPlacesByRegionIdSelected}
        />

        {regionId && (
          <SelectTopoOption
            defaultValue={placeId || "undefined"}
            data={placesForRegion}
            inputToSet={getSectorsByPlaceIdSelected}
          />
        )}
      </section>
    </div>
  );
}
