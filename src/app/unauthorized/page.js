import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Acceso no autorizado',
  description: 'No tienes permisos suficientes para acceder a esta sección'
};

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso no autorizado</h1>
        <div className="text-6xl mb-6">🔒</div>
        <p className="text-lg mb-6">
          Lo sentimos, no tienes los permisos necesarios para acceder a esta sección.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ir a inicio
          </Link>
          <Link 
            href="/profile"
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Mi perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
