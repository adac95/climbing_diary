"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from './index';

/**
 * Componente de breadcrumb persistente optimizado
 * Carga datos mínimos necesarios para mostrar nombres reales en el breadcrumb
 */
export default function SimpleBreadcrumb() {
  const pathname = usePathname();
  const [items, setItems] = useState([{ label: "Inicio", href: "/" }]);
  
  useEffect(() => {
    async function updateBreadcrumb() {
      // Siempre comenzamos con Inicio
      const breadcrumbItems = [{ label: "Inicio", href: "/" }];
      
      // Si no estamos en la sección de topos, no hacer nada más
      if (!pathname.startsWith('/topos')) {
        setItems(breadcrumbItems);
        return;
      }
      
      // Añadir "Topos" - como link solo si no estamos en /topos
      breadcrumbItems.push({ 
        label: "Topos", 
        href: pathname === '/topos' ? null : '/topos' 
      });
      
      // Si solo estamos en /topos, terminar aquí
      if (pathname === '/topos') {
        setItems(breadcrumbItems);
        return;
      }
      
      // Extraer segmentos de la ruta
      const segments = pathname.split('/').filter(Boolean);
      
      // Si hay ID de región
      if (segments.length > 1 && segments[0] === 'topos') {
        const regionId = segments[1];
        let regionName = regionId; // Valor por defecto

        try {
          // Consulta optimizada para obtener solo el nombre de la región
          const response = await fetch(`/api/get-entity-name?type=region&id=${regionId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.name) regionName = data.name;
          }
        } catch (error) {
          console.error('Error al obtener nombre de región:', error);
        }

        breadcrumbItems.push({
          label: regionName,
          href: segments.length > 2 ? `/topos/${regionId}` : null
        });
      }
      
      // Si hay ID de lugar
      if (segments.length > 2 && segments[0] === 'topos') {
        const placeId = segments[2];
        let placeName = placeId; // Valor por defecto

        try {
          // Consulta optimizada para obtener solo el nombre del lugar
          const response = await fetch(`/api/get-entity-name?type=place&id=${placeId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.name) placeName = data.name;
          }
        } catch (error) {
          console.error('Error al obtener nombre de lugar:', error);
        }

        breadcrumbItems.push({
          label: placeName,
          href: segments.length > 3 ? `/topos/${segments[1]}/${placeId}` : null
        });
      }
      
      // Si está en la vista de sectores
      if (segments.length > 3 && segments[3] === 'sectores' && segments[0] === 'topos') {
        breadcrumbItems.push({
          label: "Sectores",
          href: segments.length > 4 ? `/topos/${segments[1]}/${segments[2]}/sectores` : null
        });
      }
      
      // Si hay un sector específico
      if (segments.length > 4 && segments[3] === 'sectores' && segments[0] === 'topos') {
        const sectorId = segments[4];
        let sectorName = sectorId; // Valor por defecto

        try {
          // Consulta optimizada para obtener solo el nombre del sector
          const response = await fetch(`/api/get-entity-name?type=sector&id=${sectorId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.name) sectorName = data.name;
          }
        } catch (error) {
          console.error('Error al obtener nombre de sector:', error);
        }

        breadcrumbItems.push({
          label: sectorName,
          href: null // Último item sin enlace
        });
      }
      
      setItems(breadcrumbItems);
    }
    
    updateBreadcrumb();
  }, [pathname]);
  
  return <Breadcrumb items={items} />;
}
