export const roleCodes = [
  "super_admin",
  "admin",
  "editor",
  "support",
  "finance",
  "project_manager",
  "customer",
] as const;

export type RoleCode = (typeof roleCodes)[number];

export const permissions = [
  "workspace.access",
  "profile.manage_own",
  "leads.read_own",
  "leads.read",
  "leads.manage",
  "clients.read",
  "clients.manage",
  "projects.read_own",
  "projects.read",
  "projects.manage",
  "milestones.approve",
  "files.read_own",
  "files.read",
  "files.manage",
  "tickets.manage_own",
  "tickets.read",
  "tickets.manage",
  "finance.read_own",
  "finance.read",
  "finance.manage",
  "notifications.read_own",
  "notifications.manage",
  "cms.read",
  "cms.manage",
  "cms.publish",
  "analytics.read",
  "users.read",
  "users.manage",
  "roles.manage",
  "settings.manage",
  "audit.read",
] as const;

export type Permission = (typeof permissions)[number];

export const clientMemberRoles = ["OWNER", "ADMIN", "MEMBER", "BILLING", "VIEWER"] as const;
export type ClientMemberRoleCode = (typeof clientMemberRoles)[number];

export const projectMemberRoles = [
  "OWNER",
  "MANAGER",
  "CONTRIBUTOR",
  "CLIENT_APPROVER",
  "CLIENT_VIEWER",
] as const;
export type ProjectMemberRoleCode = (typeof projectMemberRoles)[number];

export type Actor = {
  userId: string;
  roles: readonly string[];
  permissions: readonly string[];
  clientIds: readonly string[];
  projectIds: readonly string[];
  clientMemberships: readonly {
    clientId: string;
    role: ClientMemberRoleCode;
  }[];
  projectMemberships: readonly {
    projectId: string;
    role: ProjectMemberRoleCode;
    canViewFinance: boolean;
  }[];
};

export function isRoleCode(value: string): value is RoleCode {
  return roleCodes.some((role) => role === value);
}

export function hasPermission(actor: Actor, permission: Permission): boolean {
  return actor.permissions.includes(permission);
}

export function hasAnyPermission(
  actor: Actor,
  requiredPermissions: readonly Permission[],
): boolean {
  return requiredPermissions.some((permission) => hasPermission(actor, permission));
}

export function isStaff(actor: Actor): boolean {
  return actor.roles.some((role) => isRoleCode(role) && role !== "customer");
}

export function hasClientRole(
  actor: Actor,
  clientId: string,
  allowedRoles: readonly ClientMemberRoleCode[],
): boolean {
  return actor.clientMemberships.some(
    (membership) => membership.clientId === clientId && allowedRoles.includes(membership.role),
  );
}

export function isClientAdministrator(actor: Actor, clientId: string): boolean {
  return hasClientRole(actor, clientId, ["OWNER", "ADMIN"]);
}

export function canAccessClient(actor: Actor, clientId: string): boolean {
  return hasPermission(actor, "clients.read") || actor.clientIds.includes(clientId);
}

export function canAccessProject(
  actor: Actor,
  resource: { id: string; clientId: string },
): boolean {
  return (
    hasPermission(actor, "projects.read") ||
    actor.projectIds.includes(resource.id) ||
    isClientAdministrator(actor, resource.clientId)
  );
}

export function canAccessTicket(
  actor: Actor,
  resource: { clientId: string; projectId: string | null; openedById: string },
): boolean {
  return (
    hasPermission(actor, "tickets.read") ||
    hasPermission(actor, "tickets.manage") ||
    (resource.openedById === actor.userId && actor.clientIds.includes(resource.clientId)) ||
    isClientAdministrator(actor, resource.clientId) ||
    (resource.projectId !== null && actor.projectIds.includes(resource.projectId))
  );
}

export function canViewFinanceResource(
  actor: Actor,
  resource: { clientId: string; projectId: string | null },
): boolean {
  if (hasPermission(actor, "finance.read") || hasPermission(actor, "finance.manage")) return true;
  if (hasClientRole(actor, resource.clientId, ["OWNER", "ADMIN", "BILLING"])) return true;
  if (resource.projectId === null) return false;
  return actor.projectMemberships.some(
    (membership) => membership.projectId === resource.projectId && membership.canViewFinance,
  );
}

export class AuthorizationError extends Error {
  override readonly name = "AuthorizationError";

  constructor(message = "You are not allowed to perform this action.") {
    super(message);
  }
}

export function requirePermission(actor: Actor, permission: Permission): void {
  if (!hasPermission(actor, permission)) throw new AuthorizationError();
}

export function requireAnyPermission(
  actor: Actor,
  requiredPermissions: readonly Permission[],
): void {
  if (!hasAnyPermission(actor, requiredPermissions)) throw new AuthorizationError();
}

export function requireClientAccess(actor: Actor, clientId: string): void {
  if (!canAccessClient(actor, clientId)) throw new AuthorizationError();
}

export function requireProjectAccess(
  actor: Actor,
  resource: { id: string; clientId: string },
): void {
  if (!canAccessProject(actor, resource)) throw new AuthorizationError();
}
