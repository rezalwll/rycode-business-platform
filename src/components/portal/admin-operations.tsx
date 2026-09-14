"use client";

import {
  addLeadNoteAction,
  assignLeadAction,
  convertLeadAction,
  createProjectAction,
  updateLeadStatusAction,
  updateProjectAction,
  createMilestoneAction,
  updateMilestoneAction,
  replyToTicketAction,
  resolveTicketAction,
} from "@/features/business/actions";
import {
  addLeadNoteSchema,
  assignLeadSchema,
  convertLeadSchema,
  createProjectSchema,
  updateLeadStatusSchema,
  updateProjectSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  replyTicketSchema,
  resolveTicketSchema,
  leadStatuses,
  projectStatuses,
  milestoneStatuses,
} from "@/features/business/schemas";
import type { Locale } from "@/i18n/routing";

import {
  AdminCheck,
  AdminField,
  AdminForm,
  AdminSelect,
  AdminText,
  label,
  optionalValue,
  statusOptions,
  textValue,
  type Option,
} from "./admin-form";

type ClientOption = { id: string; displayName: string };
const clientsAsOptions = (clients: readonly ClientOption[]): Option[] =>
  clients.map((client) => ({ value: client.id, label: client.displayName }));
const blank = (locale: Locale): Option => ({
  value: "",
  label: label(locale, "انتخاب کنید", "Select an option"),
});

export function AdminLeadOperations({
  locale,
  lead,
  clients,
  owners,
  canConvert,
}: {
  locale: Locale;
  lead: {
    id: string;
    name: string;
    company: string | null;
    status: string;
    ownerId: string | null;
    converted: boolean;
  };
  clients: readonly ClientOption[];
  owners: readonly { id: string; name: string }[];
  canConvert: boolean;
}) {
  return (
    <div className="mt-8 grid items-start gap-4 xl:grid-cols-2">
      <AdminForm
        locale={locale}
        title={label(locale, "تغییر وضعیت سرنخ", "Change lead status")}
        description={label(
          locale,
          "وضعیت پیگیری و دلیل تغییر را ثبت کنید.",
          "Record the follow-up status and reason for this change.",
        )}
        action={updateLeadStatusAction}
        schema={updateLeadStatusSchema}
        build={(data) => ({
          leadId: lead.id,
          status: textValue(data, "status"),
          note: optionalValue(data, "note"),
        })}
      >
        <AdminSelect
          name="status"
          title={label(locale, "وضعیت", "Status")}
          options={statusOptions(leadStatuses)}
          defaultValue={lead.status}
        />
        <AdminText
          name="note"
          title={label(locale, "دلیل تغییر", "Reason for change")}
          maxLength={5_000}
        />
      </AdminForm>
      <AdminForm
        locale={locale}
        title={label(locale, "یادداشت داخلی", "Internal note")}
        description={label(
          locale,
          "نکات تماس و تصمیم‌های تیم را به سابقه سرنخ اضافه کنید.",
          "Add call notes and team decisions to the lead history.",
        )}
        action={addLeadNoteAction}
        schema={addLeadNoteSchema}
        build={(data) => ({ leadId: lead.id, note: textValue(data, "note") })}
      >
        <AdminText
          name="note"
          title={label(locale, "یادداشت", "Note")}
          required
          maxLength={5_000}
        />
      </AdminForm>
      <AdminForm
        locale={locale}
        title={label(locale, "مسئول پیگیری", "Lead owner")}
        description={label(
          locale,
          "مسئول پیگیری این درخواست را تعیین کنید.",
          "Assign the team member responsible for this request.",
        )}
        action={assignLeadAction}
        schema={assignLeadSchema}
        build={(data) => ({ leadId: lead.id, ownerId: optionalValue(data, "ownerId") ?? null })}
      >
        <AdminSelect
          name="ownerId"
          title={label(locale, "مسئول", "Owner")}
          defaultValue={lead.ownerId ?? ""}
          options={[
            { value: "", label: label(locale, "بدون مسئول", "Unassigned") },
            ...owners.map((owner) => ({ value: owner.id, label: owner.name })),
          ]}
        />
      </AdminForm>
      {canConvert && !lead.converted && !["LOST", "SPAM", "ARCHIVED"].includes(lead.status) && (
        <AdminForm
          locale={locale}
          title={label(locale, "تبدیل به پروژه", "Convert to a project")}
          description={label(
            locale,
            "یک مشتری موجود انتخاب کنید؛ با انتخاب «مشتری جدید»، اطلاعات سرنخ برای ساخت مشتری استفاده می‌شود.",
            "Choose an existing client, or create a client using the lead’s contact details.",
          )}
          submit={label(locale, "ساخت مشتری و پروژه", "Create client and project")}
          action={convertLeadAction}
          schema={convertLeadSchema}
          build={(data) => ({
            leadId: lead.id,
            ...(optionalValue(data, "clientId")
              ? { clientId: textValue(data, "clientId") }
              : { client: { displayName: textValue(data, "clientName") } }),
            project: {
              name: textValue(data, "name"),
              scope: optionalValue(data, "scope"),
              status: "PLANNED",
            },
          })}
        >
          <AdminSelect
            name="clientId"
            title={label(locale, "مشتری", "Client")}
            options={[
              { value: "", label: label(locale, "مشتری جدید", "New client") },
              ...clientsAsOptions(clients),
            ]}
          />
          <AdminField
            name="clientName"
            title={label(locale, "نام مشتری جدید", "New client name")}
            defaultValue={lead.company ?? lead.name}
            minLength={2}
            maxLength={200}
          />
          <AdminField
            name="name"
            title={label(locale, "نام پروژه", "Project name")}
            required
            minLength={2}
            maxLength={220}
            wide
          />
          <AdminText name="scope" title={label(locale, "محدوده پروژه", "Project scope")} />
        </AdminForm>
      )}
    </div>
  );
}

export function AdminCreateProject({
  locale,
  clients,
}: {
  locale: Locale;
  clients: readonly ClientOption[];
}) {
  return (
    <div className="mt-8">
      <AdminForm
        locale={locale}
        title={label(locale, "پروژه جدید", "New project")}
        description={label(
          locale,
          "پروژه را برای یک مشتری فعال ایجاد کنید.",
          "Create a delivery project for an active client.",
        )}
        action={createProjectAction}
        schema={createProjectSchema}
        build={(data) => ({
          clientId: textValue(data, "clientId"),
          name: textValue(data, "name"),
          scope: optionalValue(data, "scope"),
          status: textValue(data, "status"),
          startDate: optionalValue(data, "startDate"),
          expectedEndDate: optionalValue(data, "expectedEndDate"),
        })}
      >
        <AdminSelect
          name="clientId"
          title={label(locale, "مشتری", "Client")}
          options={[blank(locale), ...clientsAsOptions(clients)]}
          required
        />
        <AdminField
          name="name"
          title={label(locale, "نام پروژه", "Project name")}
          minLength={2}
          maxLength={220}
          required
        />
        <AdminSelect
          name="status"
          title={label(locale, "وضعیت", "Status")}
          options={statusOptions(["DRAFT", "PLANNED", "ACTIVE"])}
          defaultValue="DRAFT"
        />
        <AdminField name="startDate" title={label(locale, "شروع", "Start date")} type="date" />
        <AdminField
          name="expectedEndDate"
          title={label(locale, "پایان مورد انتظار", "Expected end date")}
          type="date"
        />
        <AdminText name="scope" title={label(locale, "محدوده پروژه", "Project scope")} />
      </AdminForm>
    </div>
  );
}

export type EditableMilestone = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  position: number;
  approvalRequired: boolean;
  expectedEndDate: string;
};

export function AdminProjectOperations({
  locale,
  project,
}: {
  locale: Locale;
  project: {
    id: string;
    name: string;
    status: string;
    progress: number;
    scope: string | null;
    latestUpdate: string | null;
    clientAction: string | null;
    startDate: string;
    expectedEndDate: string;
    milestones: readonly EditableMilestone[];
  };
}) {
  return (
    <div className="mt-8 space-y-4">
      <AdminForm
        locale={locale}
        title={label(locale, "ویرایش پروژه", "Edit project")}
        description={label(
          locale,
          "وضعیت تحویل و اطلاعات قابل مشاهده برای مشتری را به‌روز کنید.",
          "Update delivery status and information visible to the client.",
        )}
        action={updateProjectAction}
        schema={updateProjectSchema}
        build={(data) => ({
          projectId: project.id,
          name: textValue(data, "name"),
          status: textValue(data, "status"),
          progress: Number(textValue(data, "progress")),
          scope: optionalValue(data, "scope"),
          latestUpdate: optionalValue(data, "latestUpdate"),
          clientAction: optionalValue(data, "clientAction"),
          startDate: optionalValue(data, "startDate") ?? null,
          expectedEndDate: optionalValue(data, "expectedEndDate") ?? null,
        })}
      >
        <AdminField
          name="name"
          title={label(locale, "نام پروژه", "Project name")}
          defaultValue={project.name}
          required
          minLength={2}
          maxLength={220}
        />
        <AdminSelect
          name="status"
          title={label(locale, "وضعیت", "Status")}
          defaultValue={project.status}
          options={statusOptions(projectStatuses)}
        />
        <AdminField
          name="progress"
          title={label(locale, "پیشرفت (درصد)", "Progress (%)")}
          type="number"
          min={0}
          max={100}
          step={1}
          defaultValue={project.progress}
          required
        />
        <AdminField
          name="startDate"
          title={label(locale, "شروع", "Start date")}
          type="date"
          defaultValue={project.startDate}
        />
        <AdminField
          name="expectedEndDate"
          title={label(locale, "پایان مورد انتظار", "Expected end date")}
          type="date"
          defaultValue={project.expectedEndDate}
        />
        <AdminText
          name="scope"
          title={label(locale, "محدوده پروژه", "Project scope")}
          defaultValue={project.scope}
        />
        <AdminText
          name="latestUpdate"
          title={label(locale, "آخرین گزارش برای مشتری", "Latest client update")}
          defaultValue={project.latestUpdate}
          maxLength={10_000}
        />
        <AdminText
          name="clientAction"
          title={label(locale, "اقدام موردنیاز مشتری", "Action needed from the client")}
          defaultValue={project.clientAction}
          maxLength={5_000}
        />
      </AdminForm>
      <AdminForm
        locale={locale}
        title={label(locale, "مرحله تحویل جدید", "New milestone")}
        description={label(
          locale,
          "هر مرحله یک ترتیب یکتا دارد. برای تأیید مشتری، نیاز به تأیید را فعال کنید.",
          "Each milestone has a unique position. Enable approval when the client must sign off.",
        )}
        action={createMilestoneAction}
        schema={createMilestoneSchema}
        build={(data) => ({
          projectId: project.id,
          title: textValue(data, "title"),
          description: optionalValue(data, "description"),
          position: Number(textValue(data, "position")),
          approvalRequired: data.has("approvalRequired"),
          expectedEndDate: optionalValue(data, "expectedEndDate"),
        })}
      >
        <AdminField
          name="title"
          title={label(locale, "عنوان مرحله", "Milestone title")}
          minLength={2}
          maxLength={220}
          required
        />
        <AdminField
          name="position"
          title={label(locale, "ترتیب", "Position")}
          type="number"
          min={0}
          max={10_000}
          step={1}
          required
          defaultValue={
            Math.max(-1, ...project.milestones.map((milestone) => milestone.position)) + 1
          }
        />
        <AdminField
          name="expectedEndDate"
          title={label(locale, "سررسید", "Due date")}
          type="date"
        />
        <AdminCheck
          name="approvalRequired"
          title={label(locale, "نیاز به تأیید مشتری", "Requires client approval")}
        />
        <AdminText
          name="description"
          title={label(locale, "شرح تحویل", "Deliverable description")}
        />
      </AdminForm>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        {project.milestones.map((milestone) => (
          <AdminForm
            key={`${milestone.id}:${milestone.status}:${milestone.progress}`}
            locale={locale}
            title={milestone.title}
            description={`${milestone.status} · ${milestone.progress}%`}
            action={updateMilestoneAction}
            schema={updateMilestoneSchema}
            build={(data) => ({
              milestoneId: milestone.id,
              title: textValue(data, "title"),
              description: optionalValue(data, "description"),
              ...(textValue(data, "status") !== "APPROVED"
                ? { status: textValue(data, "status") }
                : {}),
              progress: Number(textValue(data, "progress")),
              position: Number(textValue(data, "position")),
              approvalRequired: data.has("approvalRequired"),
              expectedEndDate: optionalValue(data, "expectedEndDate") ?? null,
            })}
          >
            <AdminField
              name="title"
              title={label(locale, "عنوان", "Title")}
              defaultValue={milestone.title}
              minLength={2}
              maxLength={220}
              required
            />
            <AdminSelect
              name="status"
              title={label(locale, "وضعیت", "Status")}
              defaultValue={milestone.status}
              options={statusOptions(
                milestoneStatuses.filter(
                  (status) => status !== "APPROVED" || milestone.status === "APPROVED",
                ),
              )}
            />
            <AdminField
              name="progress"
              title={label(locale, "پیشرفت (درصد)", "Progress (%)")}
              type="number"
              min={0}
              max={100}
              step={1}
              required
              defaultValue={milestone.progress}
            />
            <AdminField
              name="position"
              title={label(locale, "ترتیب", "Position")}
              type="number"
              min={0}
              max={10_000}
              step={1}
              required
              defaultValue={milestone.position}
            />
            <AdminField
              name="expectedEndDate"
              title={label(locale, "سررسید", "Due date")}
              type="date"
              defaultValue={milestone.expectedEndDate}
            />
            <AdminCheck
              name="approvalRequired"
              title={label(locale, "نیاز به تأیید مشتری", "Requires client approval")}
              defaultChecked={milestone.approvalRequired}
            />
            <AdminText
              name="description"
              title={label(locale, "شرح", "Description")}
              defaultValue={milestone.description}
            />
          </AdminForm>
        ))}
      </div>
    </div>
  );
}

export function AdminTicketOperations({
  locale,
  ticketId,
  status,
}: {
  locale: Locale;
  ticketId: string;
  status: string;
}) {
  if (status === "CLOSED") return null;
  return (
    <div className="mt-8 grid items-start gap-4 xl:grid-cols-2">
      <AdminForm
        locale={locale}
        title={label(locale, "پاسخ به تیکت", "Reply to ticket")}
        description={label(
          locale,
          "پاسخ عمومی برای مشتری قابل مشاهده است. یادداشت داخلی فقط برای تیم نمایش داده می‌شود.",
          "Public replies are visible to the client. Internal notes stay within the team.",
        )}
        action={replyToTicketAction}
        schema={replyTicketSchema}
        build={(data) => ({
          ticketId,
          body: textValue(data, "body"),
          visibility: textValue(data, "visibility"),
        })}
      >
        <AdminSelect
          name="visibility"
          title={label(locale, "نوع پیام", "Message visibility")}
          defaultValue="PUBLIC"
          options={[
            { value: "PUBLIC", label: label(locale, "پاسخ به مشتری", "Reply to client") },
            { value: "INTERNAL", label: label(locale, "یادداشت داخلی", "Internal note") },
          ]}
        />
        <AdminText
          name="body"
          title={label(locale, "پیام", "Message")}
          required
          maxLength={30_000}
        />
      </AdminForm>
      {status !== "RESOLVED" && (
        <AdminForm
          locale={locale}
          title={label(locale, "حل تیکت", "Resolve ticket")}
          description={label(
            locale,
            "نتیجه حل مسئله را برای مشتری ثبت کنید.",
            "Record the resolution for the client.",
          )}
          action={resolveTicketAction}
          schema={resolveTicketSchema}
          build={(data) => ({ ticketId, note: optionalValue(data, "note") })}
          submit={label(locale, "ثبت به‌عنوان حل‌شده", "Mark resolved")}
        >
          <AdminText
            name="note"
            title={label(
              locale,
              "توضیح نتیجه (قابل مشاهده برای مشتری)",
              "Resolution note (visible to client)",
            )}
            maxLength={5_000}
          />
        </AdminForm>
      )}
    </div>
  );
}
