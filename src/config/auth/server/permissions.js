// Tipos de roles y sus permisos
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: ['read', 'write', 'delete', 'manage_users'],
  [ROLES.USER]: ['read', 'write'],
  [ROLES.GUEST]: ['read']
}; 