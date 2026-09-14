import "dotenv/config";

import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const permissions = [
  ["workspace.access", "Access the authenticated workspace"],
  ["profile.manage_own", "Read and update the current user's profile"],
  ["leads.read_own", "Read leads submitted by the current user or client"],
  ["leads.read", "Read all leads"],
  ["leads.manage", "Qualify, assign, convert, and archive leads"],
  ["clients.read", "Read client organizations and memberships"],
  ["clients.manage", "Create and manage clients and memberships"],
  ["projects.read_own", "Read projects granted through membership"],
  ["projects.read", "Read all projects"],
  ["projects.manage", "Create and manage projects and milestones"],
  ["milestones.approve", "Approve or request changes to assigned milestones"],
  ["files.read_own", "Read files granted through a visible business record"],
  ["files.read", "Read files within an authorized staff scope"],
  ["files.manage", "Upload, attach, quarantine, and retire files"],
  ["tickets.manage_own", "Create and manage tickets for the current client"],
  ["tickets.read", "Read tickets within an authorized staff scope"],
  ["tickets.manage", "Assign, reply to, resolve, and close tickets"],
  ["finance.read_own", "Read invoices and payments for the current client"],
  ["finance.read", "Read financial records"],
  ["finance.manage", "Issue invoices and record or allocate payments"],
  ["notifications.read_own", "Read and dismiss the current user's notifications"],
  ["notifications.manage", "Create operational notifications"],
  ["cms.read", "Read CMS drafts and editorial metadata"],
  ["cms.manage", "Create and edit CMS content"],
  ["cms.publish", "Publish, schedule, archive, and redirect content"],
  ["analytics.read", "Read first-party analytics reports"],
  ["users.read", "Read user and membership data"],
  ["users.manage", "Invite, suspend, and update users"],
  ["roles.manage", "Assign roles and manage role permissions"],
  ["settings.manage", "Manage private site and platform settings"],
  ["audit.read", "Read immutable audit history"],
] as const;

const roleDefinitions = [
  {
    key: "customer",
    name: "Customer",
    description: "Client-scoped access to owned projects, finance, files, and support.",
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
  },
  {
    key: "support",
    name: "Support",
    description: "Operational access to clients, projects, files, and support tickets.",
    permissions: [
      "workspace.access",
      "profile.manage_own",
      "clients.read",
      "projects.read",
      "files.read",
      "files.manage",
      "tickets.read",
      "tickets.manage",
      "notifications.read_own",
      "notifications.manage",
      "users.read",
    ],
  },
  {
    key: "editor",
    name: "Editor",
    description: "Editorial access to draft and review CMS content without publish authority.",
    permissions: [
      "workspace.access",
      "profile.manage_own",
      "files.read",
      "files.manage",
      "cms.read",
      "cms.manage",
      "notifications.read_own",
    ],
  },
  {
    key: "finance",
    name: "Finance",
    description: "Restricted access to client identity and financial operations.",
    permissions: [
      "workspace.access",
      "profile.manage_own",
      "clients.read",
      "projects.read",
      "finance.read",
      "finance.manage",
      "notifications.read_own",
    ],
  },
  {
    key: "project_manager",
    name: "Project Manager",
    description: "Delivery, lead, client, project, file, and support operations.",
    permissions: [
      "workspace.access",
      "profile.manage_own",
      "leads.read",
      "leads.manage",
      "clients.read",
      "clients.manage",
      "projects.read",
      "projects.manage",
      "files.read",
      "files.manage",
      "tickets.read",
      "tickets.manage",
      "notifications.read_own",
      "notifications.manage",
    ],
  },
  {
    key: "admin",
    name: "Administrator",
    description: "Business administration excluding role and secret-setting control.",
    permissions: [
      "workspace.access",
      "profile.manage_own",
      "leads.read",
      "leads.manage",
      "clients.read",
      "clients.manage",
      "projects.read",
      "projects.manage",
      "milestones.approve",
      "files.read",
      "files.manage",
      "tickets.read",
      "tickets.manage",
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
      "audit.read",
    ],
  },
  {
    key: "super_admin",
    name: "Super Administrator",
    description: "Full platform control, including roles and private settings.",
    permissions: permissions.map(([key]) => key),
  },
] as const;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function assertBootstrapPassword(password: string, email: string): void {
  if (password.length < 16) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must contain at least 16 characters.");
  }

  if (password.length > 128) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must contain at most 128 characters.");
  }

  const localPart = email.split("@", 1)[0]?.toLowerCase();
  if (localPart && localPart.length >= 4 && password.toLowerCase().includes(localPart)) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must not contain the email local part.");
  }

  const normalizedPassword = password.toLowerCase();
  const weakFragments = ["password", "administrator", "qwerty", "letmein", "123456"];
  if (weakFragments.some((fragment) => normalizedPassword.includes(fragment))) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD contains a commonly guessed pattern.");
  }

  const characterClasses = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z\d]/].filter((pattern) =>
    pattern.test(password),
  ).length;
  if (password.length < 24 && characterClasses < 3) {
    throw new Error(
      "BOOTSTRAP_ADMIN_PASSWORD must use at least three character classes or be a 24+ character passphrase.",
    );
  }
}

async function seedAuthorization(): Promise<Map<string, string>> {
  return prisma.$transaction(async (tx) => {
    const permissionIds = new Map<string, string>();

    for (const [key, description] of permissions) {
      const permission = await tx.permission.upsert({
        where: { key },
        create: { key, description },
        update: { description },
        select: { id: true },
      });
      permissionIds.set(key, permission.id);
    }

    const roleIds = new Map<string, string>();

    for (const definition of roleDefinitions) {
      const role = await tx.role.upsert({
        where: { key: definition.key },
        create: {
          key: definition.key,
          name: definition.name,
          description: definition.description,
          isSystem: true,
        },
        update: {
          name: definition.name,
          description: definition.description,
          isSystem: true,
        },
        select: { id: true },
      });
      roleIds.set(definition.key, role.id);

      const desiredPermissionIds = definition.permissions.map((key) => {
        const permissionId = permissionIds.get(key);
        if (!permissionId) {
          throw new Error(`Unknown permission in role definition: ${key}`);
        }
        return permissionId;
      });

      await tx.rolePermission.deleteMany({
        where: {
          roleId: role.id,
          permissionId: { notIn: desiredPermissionIds },
        },
      });

      await tx.rolePermission.createMany({
        data: desiredPermissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
        skipDuplicates: true,
      });
    }

    return roleIds;
  });
}

async function bootstrapAdministrator(superAdminRoleId: string): Promise<void> {
  const rawEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const rawPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!rawEmail && !rawPassword) {
    return;
  }

  if (!rawEmail || !rawPassword) {
    throw new Error(
      "BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must either both be set or both be omitted.",
    );
  }

  const email = normalizeEmail(rawEmail);
  assertBootstrapPassword(rawPassword, email);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  const userId = existingUser?.id ?? randomUUID();
  const credentialAccount = await prisma.account.findUnique({
    where: {
      providerId_accountId: {
        providerId: "credential",
        accountId: userId,
      },
    },
    select: { id: true },
  });
  const passwordHash = credentialAccount ? undefined : await hashPassword(rawPassword);
  const existingRoleAssignment = await prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId,
        roleId: superAdminRoleId,
      },
    },
    select: { userId: true },
  });

  if (existingUser && (!credentialAccount || !existingRoleAssignment)) {
    throw new Error(
      "Refusing to bootstrap an existing account. Use a new administrator email or the audited role-management workflow.",
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { email },
      create: {
        id: userId,
        email,
        emailVerified: true,
        name: "RYCODE Administrator",
      },
      update: {},
    });

    await tx.profile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: "RYCODE Administrator",
        locale: "fa",
        timezone: "Asia/Tehran",
      },
      update: {},
    });

    if (passwordHash) {
      await tx.account.create({
        data: {
          id: randomUUID(),
          userId,
          providerId: "credential",
          accountId: userId,
          password: passwordHash,
        },
      });
    }

    await tx.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: superAdminRoleId,
        },
      },
      create: {
        userId,
        roleId: superAdminRoleId,
      },
      update: {},
    });

    if (!existingRoleAssignment) {
      await tx.auditLog.create({
        data: {
          action: "authorization.role_granted",
          entityType: "user",
          entityId: userId,
          metadata: {
            role: "super_admin",
            source: "bootstrap_seed",
          },
        },
      });
    }

    if (passwordHash) {
      await tx.auditLog.create({
        data: {
          action: "authentication.credential_created",
          entityType: "user",
          entityId: userId,
          metadata: {
            provider: "credential",
            source: "bootstrap_seed",
          },
        },
      });
    }
  });
}

async function main(): Promise<void> {
  const roleIds = await seedAuthorization();
  const superAdminRoleId = roleIds.get("super_admin");

  if (!superAdminRoleId) {
    throw new Error("The super_admin role was not seeded.");
  }

  await bootstrapAdministrator(superAdminRoleId);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
