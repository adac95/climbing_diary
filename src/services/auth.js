// src/services/auth.js
// API unificada que exporta tanto funcionalidades de servidor como de cliente

import ServerAuth from './auth.server';
import ClientAuth from './auth.client';

/**
 * Servicio de autenticación unificado
 * ADVERTENCIA: Por compatibilidad con código existente.
 * Para código nuevo, preferir importar directamente ServerAuth o ClientAuth.
 */
const AuthService = {
  // API del Servidor
  requireAuth: ServerAuth.requireAuth,
  loginWithCredentials: ServerAuth.loginWithCredentials,
  getAuthenticatedUser: ServerAuth.getAuthenticatedUser,

  // API del Cliente
  login: ClientAuth.login,
  logout: ClientAuth.logout,
  getCurrentSession: ClientAuth.getCurrentSession,
};

export { ServerAuth, ClientAuth };
export default AuthService;
