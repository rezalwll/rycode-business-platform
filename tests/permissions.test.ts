import { describe, expect, it } from "vitest";

import {
  canAccessClient,
  canAccessProject,
  canAccessTicket,
  hasPermission,
  type Actor,
} from "@/server/auth/permissions";

const customer: Actor = {
  userId: "user-a",
  roles: ["customer"],
  permissions: [
    "workspace.access",
    "profile.manage_own",
    "leads.read_own",
    "projects.read_own",
    "milestones.approve",
    "files.read_own",
    "tickets.manage_own",
    "finance.read_own",
    "notifications.read_own",
  ],
  clientIds: ["client-a"],
  projectIds: ["project-a"],
  clientMemberships: [{ clientId: "client-a", role: "MEMBER" }],
  projectMemberships: [{ projectId: "project-a", role: "CLIENT_VIEWER", canViewFinance: false }],
};

describe("server authorization policy", () => {
  it("revokes access to opened tickets when client membership is removed", () => {
    const ticket = { openedById: customer.userId, clientId: "client-a", projectId: null };
    expect(canAccessTicket(customer, ticket)).toBe(true);
    expect(canAccessTicket({ ...customer, clientIds: [], clientMemberships: [] }, ticket)).toBe(
      false,
    );
  });
  it("does not grant staff permissions to a customer", () => {
    expect(hasPermission(customer, "users.manage")).toBe(false);
    expect(hasPermission(customer, "finance.manage")).toBe(false);
    expect(hasPermission(customer, "roles.manage")).toBe(false);
  });

  it("isolates customer and project records", () => {
    expect(canAccessClient(customer, "client-a")).toBe(true);
    expect(canAccessClient(customer, "client-b")).toBe(false);
    expect(canAccessProject(customer, { id: "project-a", clientId: "client-a" })).toBe(true);
    expect(canAccessProject(customer, { id: "project-b", clientId: "client-b" })).toBe(false);
  });

  it("keeps role management exclusive to the owner", () => {
    const admin: Actor = {
      userId: "admin",
      roles: ["admin"],
      permissions: ["workspace.access"],
      clientIds: [],
      projectIds: [],
      clientMemberships: [],
      projectMemberships: [],
    };
    const owner: Actor = {
      userId: "owner",
      roles: ["super_admin"],
      permissions: ["workspace.access", "roles.manage"],
      clientIds: [],
      projectIds: [],
      clientMemberships: [],
      projectMemberships: [],
    };

    expect(hasPermission(admin, "roles.manage")).toBe(false);
    expect(hasPermission(owner, "roles.manage")).toBe(true);
  });

  it("defaults unknown and unpersisted role permissions to deny", () => {
    const typoRole: Actor = {
      ...customer,
      roles: ["super_admn"],
      permissions: [],
    };
    const unseededAdmin: Actor = {
      ...customer,
      roles: ["admin"],
      permissions: [],
    };

    expect(hasPermission(typoRole, "users.manage")).toBe(false);
    expect(hasPermission(unseededAdmin, "users.manage")).toBe(false);
  });

  it("does not expand a regular client membership into every client project", () => {
    expect(canAccessProject(customer, { id: "project-b", clientId: "client-a" })).toBe(false);
    const owner = {
      ...customer,
      clientMemberships: [{ clientId: "client-a", role: "OWNER" as const }],
    };
    expect(canAccessProject(owner, { id: "project-b", clientId: "client-a" })).toBe(true);
  });
});
