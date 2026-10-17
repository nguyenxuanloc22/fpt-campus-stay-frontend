import type { Role } from '@campusstay/constants';
import type { Permission } from './permissions';
import { ROLE_PERMISSIONS } from './matrix';

/**
 * Checks whether a role has a specific permission.
 * Single source of truth for frontend authorization checks.
 */
export function can(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Checks whether a role has ANY of the provided permissions.
 */
export function canAny(role: Role | null | undefined, permissions: Permission[]): boolean {
  if (!role || permissions.length === 0) return false;
  return permissions.some((perm) => can(role, perm));
}

/**
 * Checks whether a role has ALL of the provided permissions.
 */
export function canAll(role: Role | null | undefined, permissions: Permission[]): boolean {
  if (!role || permissions.length === 0) return false;
  return permissions.every((perm) => can(role, perm));
}
