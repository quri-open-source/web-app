/**
 * Entity class for User Profile
 */
export class UserProfile {
  public id: string;
  public username: string;
  public roles: string[];

  constructor(id: string, username: string, roles: string[]) {
    this.id = id;
    this.username = username;
    this.roles = roles;
  }

  /**
   * Get the display name for the first role
   */
  getPrimaryRoleDisplay(): string {
    if (this.roles.length === 0) return 'No Role';

    const roleDisplayMap: { [key: string]: string } = {
      'ROLE_USER': 'Customer',
      'ROLE_ADMIN': 'Administrator',
      'ROLE_MANUFACTURER': 'Manufacturer',
      'ROLE_DESIGNER': 'Designer'
    };

    return roleDisplayMap[this.roles[0]] || this.roles[0];
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  /**
   * Check if user is manufacturer
   */
  isManufacturer(): boolean {
    return this.hasRole('ROLE_MANUFACTURER');
  }

  /**
   * Check if user is designer
   */
  isDesigner(): boolean {
    return this.hasRole('ROLE_DESIGNER');
  }
}
