/**
 * Enum for user roles
 * Based on the backend Roles enum
 */
export enum UserRoles {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_MANUFACTURER = 'ROLE_MANUFACTURER',
  ROLE_DESIGNER = 'ROLE_DESIGNER',
}

/**
 * Interface for role option display
 */
export interface RoleOption {
  value: UserRoles;
  label: string;
  description: string;
}

/**
 * Available role options for user selection
 */
export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: UserRoles.ROLE_USER,
    label: 'Customer',
    description: 'Browse and purchase custom designs',
  },
  {
    value: UserRoles.ROLE_ADMIN,
    label: 'Admin',
    description: 'Full access to the system',
  },
  {
    value: UserRoles.ROLE_DESIGNER,
    label: 'Designer',
    description: 'Create and sell custom designs',
  },
  {
    value: UserRoles.ROLE_MANUFACTURER,
    label: 'Manufacturer',
    description: 'Produce and fulfill orders',
  },
];
