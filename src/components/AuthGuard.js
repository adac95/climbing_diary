'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ClientAuth from '@/services/auth.client';
import { getSupabase } from '@utils/supabase/client';

// Tiempo máximo de carga antes de mostrar fallback
const MAX_LOADING_TIME = 3000; // 3 segundos
// Tiempo máximo de inactividad (24 horas en segundos)
const MAX_INACTIVITY_TIME = 24 * 60 * 60;

export default function AuthGuard({ children, fallback = <div>Cargando...</div> }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Función para verificar autenticación
  const checkAuthentication = async () => {
    try {
      // Obtener sesión actual
      const session = await ClientAuth.getCurrentSession();
      const authenticated = !!session;

      if (authenticated) {
        // Verificar si la sesión está inactiva
        if (await isSessionInactive(session)) {
          console.log('Sesión inactiva detectada, cerrando sesión');
          await ClientAuth.logout();
          router.push('/login?reason=inactive');
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        // Actualizar timestamp de última actividad
        await updateLastActivity(session);

        setAuthenticated(true);
      } else {
        // Si no está autenticado y estamos en una ruta protegida, redirigir
        setAuthenticated(false);
        router.push(`/login?redirectedFrom=${encodeURIComponent(pathname)}`);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setLoading(false);
      setAuthenticated(false);
      router.push('/login?error=auth_error');
    }
  };

  // Verificar si una sesión está inactiva
  const isSessionInactive = async (session) => {
    if (!session) return true;

    try {
      // Obtener última actividad desde los metadatos del usuario
      const lastActivity = session.user.user_metadata?.last_activity || 0;
      const now = Math.floor(Date.now() / 1000);

      // Si ha pasado más tiempo que el máximo permitido, la sesión está inactiva
      return (now - lastActivity) > MAX_INACTIVITY_TIME;
    } catch (error) {
      console.error('Error al verificar inactividad:', error);
      return false; // En caso de error, permitir acceso
    }
  };

  // Actualizar timestamp de última actividad
  const updateLastActivity = async (session) => {
    if (!session) return;

    try {
      const supabase = getSupabase();
      const now = Math.floor(Date.now() / 1000);

      // Actualizar metadata del usuario con la hora actual
      await supabase.auth.updateUser({
        data: { last_activity: now }
      });
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
    }
  };

  useEffect(() => {
    const handleAuthStateChange = async (event, session) => {
      // Evento de cambio de autenticación

      if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
        setLoading(false);
        router.push('/login');
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setAuthenticated(true);
        // Actualizar timestamp de última actividad
        await updateLastActivity(session);
      }
    };

    // Configurar listener para cambios de autenticación
    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Iniciar verificación de autenticación
    checkAuthentication();

    // Configurar timeout para fallback UI
    const timeoutId = setTimeout(() => {
      if (loading) {
        setShowFallback(true);
      }
    }, MAX_LOADING_TIME);

    return () => {
      // Limpiar listener y timeout
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [router, pathname]);

  // Mostrar fallback mientras carga
  if (loading && showFallback) {
    return fallback;
  }

  // Si está autenticado, mostrar el contenido protegido
  if (authenticated) {
    return children;
  }

  // No mostrar nada si no está autenticado (la redirección ya ocurrió)
  return null;
}
