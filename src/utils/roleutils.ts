import { Role } from '@/enum/role'

/**
 * Configuration des rôles avec leurs propriétés
 */
const ROLE_CONFIG = {
  [Role.ADMIN]: {
    label: 'Administrateur',
    icon: 'ShieldCheck',
    color: '#ef4444'
  },
  [Role.USER]: {
    label: 'Utilisateur',
    icon: 'User',
    color: '#3b82f6'
  }
} as const;

/**
 * Vérifie si une valeur est un rôle valide
 */
export const isValidRole = (value: any): value is Role => {
  return Object.values(Role).includes(value);
};

/**
 * Récupère le label (string) d'un rôle
 */
export const getRoleLabel = (role: Role): string => {
  return ROLE_CONFIG[role].label;
};

/**
 * Récupère l'icône d'un rôle
 */
export const getRoleIcon = (role: Role): string => {
  return ROLE_CONFIG[role].icon;
};

/**
 * Récupère la couleur d'un rôle
 */
export const getRoleColor = (role: Role): string => {
  return ROLE_CONFIG[role].color;
};

/**
 * Récupère toutes les informations d'un rôle en une seule fois
 */
export const getRoleInfo = (role: Role) => {
  return {
    role,
    label: getRoleLabel(role),
    icon: getRoleIcon(role),
    color: getRoleColor(role)
  };
};
