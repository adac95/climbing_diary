/**
 * TopoSelector - Componente para seleccionar ubicaciones de escalada
 * 
 * Este componente maneja la selección jerárquica de ubicaciones de escalada:
 * 1. Primero se selecciona una región
 * 2. Luego se muestran los lugares disponibles para esa región
 * 
 * Los datos (regions y places) se reciben desde el servidor a través del Layout
 */

"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useTransition, useMemo, useCallback, memo } from "react";
import SelectTopoOption from "./components/SelectTopoOption";
import styles from "./styles.module.css";
import { useTopoNavigation } from "src/hooks/useTopoNavigation";

const TopoSelector = memo(function TopoSelector({ regions = [], places = [] }) {
  // Hooks para navegación y manejo de estado
  const router = useRouter();
  const params = useParams();  // Obtiene params de la URL actual
  const pathname = usePathname();  // Obtener la ruta actual para mejor detección
  const [isPending, startTransition] = useTransition();  // Para transiciones suaves durante la navegación
  
  // Verificar si estamos en la ruta principal /topos (sin parámetros)
  const isToposRootPath = pathname === '/topos';
  
  // Extraer regionId y placeId de params, solo si no estamos en la ruta raíz
  const regionId = isToposRootPath ? null : params?.regionId;
  const placeId = isToposRootPath ? null : params?.placeId;

  // Filtra los lugares que pertenecen a la región seleccionada
  // Se recalcula solo cuando cambia la región o la lista de lugares
  const placesForRegion = useMemo(
    () => places.filter((place) => place.region_id?.id === regionId),
    [places, regionId]
  );

  // Hook personalizado para manejar la lógica de navegación
  const { navigateToPlace } = useTopoNavigation(regionId, placesForRegion);

  // Controla la visibilidad del selector de lugares
  // Solo se muestra cuando hay una región seleccionada
  const showPlacesSelector = Boolean(regionId);

  /**
   * Maneja el cambio de región seleccionada
   * Navega a la nueva URL de la región usando transiciones suaves
   */
  const handleRegionChange = useCallback(
    (regionInputId) => {
      if (!regionInputId) return;

      startTransition(() => {
        router.push(`/topos/${regionInputId}`, { scroll: false });
      });
    },
    [router]
  );

  /**
   * Maneja el cambio de lugar seleccionado
   * Usa el hook useTopoNavigation para determinar la ruta correcta
   * y navega a ella usando transiciones suaves
   */
  const handlePlaceChange = useCallback(
    (placeInputId) => {
      if (!placeInputId || !regionId) return;

      const path = navigateToPlace(placeInputId);
      if (path) {
        startTransition(() => {
          router.push(path, { scroll: false });
        });
      }
    },
    [navigateToPlace, regionId]
  );

  /**
   * Renderiza condicionalmente el selector de lugares
   * Solo se muestra cuando hay una región seleccionada
   */
  const renderPlaceSelector = useCallback(() => {
    if (!showPlacesSelector) return null;

    return (
      <div className={styles.placeSelector}>
        <SelectTopoOption
          data={placesForRegion}
          inputToSet={handlePlaceChange}
          defaultValue={placeId || ""}
          disabled={isPending}
        />
      </div>
    );
  }, [
    showPlacesSelector,
    placesForRegion,
    handlePlaceChange,
    placeId,
    isPending,
  ]);

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Escoge el lugar</h3>
      <section className={styles.options}>
        {/* Selector de Región - Siempre visible */}
        <div className={styles.selectorContainer}>
          <div className={styles.selectWrapper}>
            <div className={styles.selectContent}>
              <SelectTopoOption
                data={regions}
                inputToSet={handleRegionChange}
                defaultValue={isToposRootPath ? "" : regionId}
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        {/* Selector de Lugar - Condicional */}
        {renderPlaceSelector()}
      </section>
    </div>
  );
});

// Nombre para DevTools - Ayuda en la depuración
TopoSelector.displayName = "TopoSelector";

export default TopoSelector;
