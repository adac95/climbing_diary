'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

// Hook para manejar la navegación entre lugares de escalada
export const useTopoNavigation = (regionId, places = []) => {
  const pathname = usePathname();

  // Decide la ruta correcta según el lugar seleccionado
  const navigateToPlace = useCallback((placeId) => {
    // No hacemos nada si falta algún ID necesario
    if (!placeId || !regionId) return;
    
    // Buscamos el lugar seleccionado en nuestra lista
    const selectedPlace = places.find(p => p.id === placeId);
    // Checamos si estamos en la vista de sectores
    const isInSectorsView = pathname?.includes('/sectores');
    // Verificamos si el lugar tiene sectores disponibles
    const hasSectors = selectedPlace?.sectors?.length > 0;
    
    // Construimos la ruta:
    // - Si estamos en sectores y el lugar tiene sectores, mantenemos esa vista
    // - Si no, vamos a la vista general del lugar
    const path = isInSectorsView && hasSectors
      ? `/topos/${regionId}/${placeId}/sectores`
      : `/topos/${regionId}/${placeId}`;
      
    return path;
  }, [regionId, places, pathname]);

  return { navigateToPlace };
};
