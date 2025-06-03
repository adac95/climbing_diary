"use client";

import { useParams, useRouter } from "next/navigation";
import { useTransition, useMemo, useCallback } from "react";
import SelectTopoOption from "./components/SelectTopoOption";
import styles from "./styles.module.css";
import { useTopoNavigation } from "src/hooks/useTopoNavigation";

export default function TopoSelector({ regions = [], places = [] }) {
  const router = useRouter();
  const params = useParams();
  const { regionId, placeId } = params;
  const [isPending, startTransition] = useTransition();
  
  // Filtrar lugares para la región seleccionada
  const placesForRegion = useMemo(() => 
    places.filter((p) => p.region_id?.id === regionId),
    [places, regionId]
  );
  
  const { navigateToPlace } = useTopoNavigation(regionId, placesForRegion);
  
  // Determinar si mostrar el selector de lugares
  const showPlacesSelector = !!regionId;
  
  // Manejar hover en regiones
  const handleRegionHover = (regionId) => {
    if (regionId) {
      router.prefetch(`/topos/${regionId}`);
    }
  };

  // Manejar hover en lugares
  const handlePlaceHover = (placeId) => {
    if (placeId && regionId) {
      router.prefetch(`/topos/${regionId}/${placeId}`);
    }
  };

  // Obtener lugares cuando se selecciona una región
  const getPlacesByRegionIdSelected = useCallback((regionInputId) => {
    if (!regionInputId) return;
    startTransition(() => {
      router.push(`/topos/${regionInputId}`, { scroll: false });
    });
  }, [startTransition, router]);

  // Obtener sectores cuando se selecciona un lugar
  const getSectorsByPlaceIdSelected = useCallback((placeInputId) => {
    if (!placeInputId || !regionId) return;
    
    const path = navigateToPlace(placeInputId);
    if (path) {
      startTransition(() => {
        router.push(path, { scroll: false });
      });
    }
  }, [navigateToPlace, regionId, startTransition]);

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Escoge el lugar</h3>
      <section className={styles.options}>
        <div className={styles.selectorContainer}>
          <div className={styles.selectWrapper}>
            <div style={{ position: 'relative', width: '100%' }}>
              <SelectTopoOption
                data={regions}
                inputToSet={getPlacesByRegionIdSelected}
                defaultValue={regionId}
                onOptionHover={handleRegionHover}
              />
            </div>
          </div>
        </div>

        {showPlacesSelector && (
          <div style={{ position: 'relative', width: '100%', marginTop: '8px' }}>
            <SelectTopoOption
              data={placesForRegion}
              inputToSet={getSectorsByPlaceIdSelected}
              defaultValue={placeId || ""} // Mostrar el placeId si existe, si no, mostrar "-- choose --"
              onOptionHover={handlePlaceHover}
            />
          </div>
        )}
      </section>
    </div>
  );
}
