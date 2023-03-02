import { Permission, DataOptions } from '..';

export interface AclService {
  hasPermission(permission: Permission, options: DataOptions): Promise<boolean>;

  getPermissions(options: DataOptions): Promise<Permission[]>;

  checkViewPermission(permission: Permission, options: DataOptions): Promise<void>;

  clearAcl(acl?: string): void;
}

export function includesPermission(permission, permissions: Permission[]): boolean {
  return (
    permissions.includes('any') || permissions.includes(permission) || (permission == 'any' && permissions.length > 0)
  );
}
