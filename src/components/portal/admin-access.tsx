"use client";

import { setUserRolesAction } from "@/features/access/actions";
import { setUserRolesSchema } from "@/features/access/schemas";
import type { Locale } from "@/i18n/routing";

import { AdminForm, label } from "./admin-form";

export function AdminUserRolesForm({
  locale,
  user,
  roles,
}: {
  locale: Locale;
  user: { id: string; name: string; email: string; roleIds: readonly string[] };
  roles: readonly { id: string; key: string; name: string }[];
}) {
  const selected = new Set(user.roleIds);
  return (
    <AdminForm
      locale={locale}
      title={`${user.name} · ${user.email}`}
      description={label(
        locale,
        "تغییر نقش فوراً در ارزیابی مجوزهای سمت سرور اعمال و در Audit ثبت می‌شود.",
        "Role changes immediately affect server-side authorization and are audited.",
      )}
      action={setUserRolesAction}
      schema={setUserRolesSchema}
      build={(data) => ({ userId: user.id, roleIds: data.getAll("roleIds").map(String) })}
      submit={label(locale, "ذخیره نقش‌ها", "Save roles")}
    >
      <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
        {roles.map((role) => (
          <label
            key={role.id}
            className="flex min-h-10 items-center gap-3 rounded-[5px] border border-input px-3 text-sm"
          >
            <input
              type="checkbox"
              name="roleIds"
              value={role.id}
              defaultChecked={selected.has(role.id)}
              className="size-4 accent-[var(--brand)]"
            />
            <span>
              {role.name} <small className="text-muted-foreground">({role.key})</small>
            </span>
          </label>
        ))}
      </div>
    </AdminForm>
  );
}
