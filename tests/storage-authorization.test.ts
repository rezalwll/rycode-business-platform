import { describe, expect, it } from "vitest";

import type { Actor } from "../src/server/auth/permissions";
import { canReadFile, type FileAccessRecord } from "../src/server/storage/authorization";

const customer: Actor = {
  userId: "customer-1",
  roles: ["customer"],
  permissions: ["files.read_own", "tickets.manage_own", "finance.read_own"],
  clientIds: ["client-1"],
  projectIds: ["project-1"],
  clientMemberships: [{ clientId: "client-1", role: "MEMBER" }],
  projectMemberships: [{ projectId: "project-1", role: "CLIENT_VIEWER", canViewFinance: false }],
};

const emptyFile: FileAccessRecord = {
  status: "READY",
  uploadedById: null,
  projectLinks: [],
  leadLinks: [],
  ticketMessageLinks: [],
  invoiceLinks: [],
  paymentReceiptLinks: [],
  media: null,
};

describe("file authorization", () => {
  it("does not expose quarantined uploads to customers", () => {
    expect(
      canReadFile(customer, { ...emptyFile, status: "QUARANTINED", uploadedById: customer.userId }),
    ).toBe(false);
  });

  it("allows a customer to read a ready project-member file in their project", () => {
    expect(
      canReadFile(customer, {
        ...emptyFile,
        projectLinks: [
          {
            visibility: "PROJECT_MEMBERS",
            project: { id: "project-1", clientId: "client-1" },
          },
        ],
      }),
    ).toBe(true);
  });

  it("does not leak internal or unrelated project files", () => {
    expect(
      canReadFile(customer, {
        ...emptyFile,
        projectLinks: [
          { visibility: "INTERNAL", project: { id: "project-1", clientId: "client-1" } },
          {
            visibility: "PROJECT_MEMBERS",
            project: { id: "project-2", clientId: "client-2" },
          },
        ],
      }),
    ).toBe(false);
  });

  it("honors public ticket scope but never internal ticket messages", () => {
    const ticket = { openedById: customer.userId, clientId: "client-1", projectId: null };
    expect(
      canReadFile(customer, {
        ...emptyFile,
        ticketMessageLinks: [{ message: { visibility: "PUBLIC", ticket } }],
      }),
    ).toBe(true);
    expect(
      canReadFile(customer, {
        ...emptyFile,
        ticketMessageLinks: [{ message: { visibility: "INTERNAL", ticket } }],
      }),
    ).toBe(false);
  });

  it("keeps quarantined and deleted objects out of the normal download channel", () => {
    const manager: Actor = {
      userId: "manager",
      roles: ["project_manager"],
      permissions: ["files.manage"],
      clientIds: [],
      projectIds: [],
      clientMemberships: [],
      projectMemberships: [],
    };
    expect(canReadFile(manager, { ...emptyFile, status: "QUARANTINED" })).toBe(false);
    expect(canReadFile(manager, { ...emptyFile, status: "DELETED" })).toBe(false);
  });
});
