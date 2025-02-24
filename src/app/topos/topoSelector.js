"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import SelectTopoOption from "./components/SelectTopoOption";
import styles from "./styles.module.css";
import { useParams, useRouter } from "next/navigation";
import { getPlacesByRegionId } from "./fetchData";

export default function TopoSelector({ regions }) {
  const [placesFromDataBase, setPlacesToRender] = useState();
  const router = useRouter();
  const params = useParams();
  const { regionId, placeId } = params;

  useEffect(() => {
    if (regionId) {
      getPlacesByRegionId(regionId).then((data) => {
        setPlacesToRender(data);
      });
    }
  }, [regionId, placeId]);

  const getPlacesByRegionIdSelected = useCallback(
    (regionInputId) => {
      regionInputId != (null || "undefined")
        ? router.push(`/topos/${regionInputId}`)
        : router.push(`/topos`);
    },
    [router, regionId]
  );

  const getSectorsByPlaceIdSelected = useCallback(
    (placeInputId) => {
      placeInputId != (null || "undefined")
        ? router.push(`/topos/${regionId}/${placeInputId}`)
        : router.push(`/topos/${regionId}`);
    },
    [regionId, router]
  );

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
            data={placesFromDataBase}
            inputToSet={getSectorsByPlaceIdSelected}
          />
        )}
      </section>
    </div>
  );
}
