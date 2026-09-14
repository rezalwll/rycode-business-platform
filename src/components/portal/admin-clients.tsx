"use client";

import { saveClientAction, setClientMembersAction } from "@/features/business/actions";
import { saveClientSchema, setClientMembersSchema } from "@/features/business/schemas";
import type { Locale } from "@/i18n/routing";

import {
  AdminCheck,
  AdminField,
  AdminForm,
  AdminSelect,
  AdminText,
  label,
  optionalValue,
  textValue,
} from "./admin-form";

type ClientItem = {
  id: string;
  kind: string;
  displayName: string;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  taxId: string | null;
  billingAddress: unknown;
  isActive: boolean;
  members: readonly { userId: string; role: string; isPrimary: boolean }[];
};

type UserOption = { id: string; name: string; email: string };

function jsonValue(data: FormData): unknown {
  try {
    const raw = textValue(data, "billingAddress");
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    return value;
  } catch {
    return undefined;
  }
}

export function AdminClientForm({ locale, item }: { locale: Locale; item?: ClientItem }) {
  return (
    <AdminForm
      locale={locale}
      title={
        item
          ? label(locale, `ویرایش مشتری «${item.displayName}»`, `Edit client “${item.displayName}”`)
          : label(locale, "مشتری جدید", "New client")
      }
      description={label(
        locale,
        "اطلاعات پایه مجموعه و وضعیت دسترسی آن به پورتال.",
        "Core organisation details and its portal access state.",
      )}
      action={saveClientAction}
      schema={saveClientSchema}
      build={(data) => ({
        ...(item ? { clientId: item.id } : {}),
        kind: textValue(data, "kind"),
        displayName: textValue(data, "displayName"),
        legalName: optionalValue(data, "legalName"),
        email: optionalValue(data, "email"),
        phone: optionalValue(data, "phone"),
        taxId: optionalValue(data, "taxId"),
        billingAddress: jsonValue(data),
        isActive: data.has("isActive"),
      })}
      submit={label(
        locale,
        item ? "ذخیره مشتری" : "ساخت مشتری",
        item ? "Save client" : "Create client",
      )}
    >
      <AdminSelect
        name="kind"
        title={label(locale, "نوع", "Kind")}
        defaultValue={item?.kind ?? "ORGANIZATION"}
        options={[
          { value: "ORGANIZATION", label: label(locale, "سازمان", "Organisation") },
          { value: "INDIVIDUAL", label: label(locale, "شخص", "Individual") },
        ]}
      />
      <AdminCheck
        name="isActive"
        title={label(locale, "فعال", "Active")}
        defaultChecked={item?.isActive ?? true}
      />
      <AdminField
        name="displayName"
        title={label(locale, "نام نمایشی", "Display name")}
        defaultValue={item?.displayName ?? ""}
        maxLength={200}
        required
      />
      <AdminField
        name="legalName"
        title={label(locale, "نام حقوقی", "Legal name")}
        defaultValue={item?.legalName ?? ""}
        maxLength={240}
      />
      <AdminField
        name="email"
        title={label(locale, "ایمیل", "Email")}
        type="email"
        defaultValue={item?.email ?? ""}
        maxLength={320}
        dir="ltr"
      />
      <AdminField
        name="phone"
        title={label(locale, "تلفن", "Phone")}
        defaultValue={item?.phone ?? ""}
        maxLength={32}
        dir="ltr"
      />
      <AdminField
        name="taxId"
        title={label(locale, "شناسه مالیاتی", "Tax ID")}
        defaultValue={item?.taxId ?? ""}
        maxLength={64}
        dir="ltr"
        wide
      />
      <AdminText
        name="billingAddress"
        title={label(locale, "نشانی صورتحساب (JSON)", "Billing address (JSON)")}
        defaultValue={item?.billingAddress ? JSON.stringify(item.billingAddress, null, 2) : ""}
        maxLength={20_000}
      />
    </AdminForm>
  );
}

export function AdminClientMembersForm({
  locale,
  client,
  users,
}: {
  locale: Locale;
  client: ClientItem;
  users: readonly UserOption[];
}) {
  const memberships = new Map(client.members.map((member) => [member.userId, member]));
  return (
    <AdminForm
      locale={locale}
      title={label(locale, `اعضای «${client.displayName}»`, `Members of “${client.displayName}”`)}
      description={label(
        locale,
        "انتخاب کاربر، نقش سازمانی و در صورت نیاز عضو اصلی. حذف انتخاب، دسترسی مشتری را لغو می‌کند.",
        "Choose users, organisation roles, and optionally one primary member. Clearing a user revokes client access.",
      )}
      action={setClientMembersAction}
      schema={setClientMembersSchema}
      build={(data) => ({
        clientId: client.id,
        members: users.flatMap((user) =>
          data.has(`member:${user.id}`)
            ? [
                {
                  userId: user.id,
                  role: textValue(data, `role:${user.id}`),
                  isPrimary: textValue(data, "primaryUserId") === user.id,
                },
              ]
            : [],
        ),
      })}
      submit={label(locale, "ذخیره اعضا", "Save members")}
    >
      <div className="space-y-2 sm:col-span-2">
        {users.map((user) => {
          const membership = memberships.get(user.id);
          return (
            <div
              key={user.id}
              className="grid gap-2 rounded-[5px] border border-input p-3 sm:grid-cols-[1fr_11rem_auto] sm:items-center"
            >
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name={`member:${user.id}`}
                  defaultChecked={Boolean(membership)}
                  className="size-4 accent-[var(--brand)]"
                />
                <span>
                  {user.name} <small className="block text-muted-foreground">{user.email}</small>
                </span>
              </label>
              <AdminSelect
                name={`role:${user.id}`}
                title={label(locale, "نقش", "Role")}
                defaultValue={membership?.role ?? "MEMBER"}
                options={["OWNER", "ADMIN", "MEMBER", "BILLING", "VIEWER"].map((role) => ({
                  value: role,
                  label: role,
                }))}
              />
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="primaryUserId"
                  value={user.id}
                  defaultChecked={membership?.isPrimary ?? false}
                  className="size-4 accent-[var(--brand)]"
                />
                {label(locale, "عضو اصلی", "Primary")}
              </label>
            </div>
          );
        })}
      </div>
    </AdminForm>
  );
}
