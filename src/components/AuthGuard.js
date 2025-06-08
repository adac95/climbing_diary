'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthService from '@/services/auth.service';

export default function AuthGuard({ children, fallback = null, requiredRole = null }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(!requiredRole);

  useEffect(() => {
    let mounted = true;
    let subscription;

    const checkAuth = async () => {
      try {
        const session = await AuthService.getCurrentSession();
        
        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
          router.push('/login');
          }
          return;
        }

        // Verificar rol si es necesario
        if (requiredRole) {
          const hasRole = await AuthService.checkUserRole(requiredRole);
          if (mounted) {
            setHasRequiredRole(hasRole);
            if (!hasRole) {
              router.push('/unauthorized');
          return;
        }
          }
        }

        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error en AuthGuard:', error);
        if (mounted) {
          setIsAuthenticated(false);
          router.push('/login?error=auth');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Verificar autenticación inicial
    checkAuth();

    // Suscribirse a cambios de autenticación
    try {
      subscription = AuthService.getSupabase().auth.onAuthStateChange((event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          router.push('/login');
        } else if (event === 'SIGNED_IN') {
          checkAuth();
        } else if (event === 'TOKEN_REFRESHED') {
          checkAuth();
        }
      });
    } catch (error) {
      console.error('Error al suscribirse a cambios de autenticación:', error);
    }

    // Limpieza al desmontar
    return () => {
      mounted = false;
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error al cancelar suscripción:', error);
        }
      }
    };
  }, [router, requiredRole]);

  // Mostrar fallback mientras se verifica la autenticación
  if (isLoading) {
    return fallback;
  }

  // Solo mostrar children si está autenticado y tiene el rol requerido
  return (isAuthenticated && hasRequiredRole) ? children : null;
}
