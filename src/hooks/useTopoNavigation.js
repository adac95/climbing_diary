'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export const useTopoNavigation = (regionId, places = []) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToPlace = useCallback((placeId) => {
    if (!placeId || !regionId) return;
    
    const selectedPlace = places.find(p => p.id === placeId);
    const isInSectorsView = pathname?.includes('/sectores');
    const hasSectors = selectedPlace?.sectors?.length > 0;
    
    const path = isInSectorsView && hasSectors
      ? `/topos/${regionId}/${placeId}/sectores`
      : `/topos/${regionId}/${placeId}`;
      
    return path;
  }, [regionId, places, pathname]);

  return { navigateToPlace };
};
