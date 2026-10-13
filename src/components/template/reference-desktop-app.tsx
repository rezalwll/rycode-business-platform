"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  BatteryMedium,
  CalendarDays,
  ChevronDown,
  Grid2X2,
  Heart,
  List,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  UsersRound,
  Wifi,
} from "lucide-react";
const sidebar = [
  { label: "Orders", Icon: CalendarDays },
  { label: "Clients", Icon: UsersRound },
  { label: "Reports", Icon: Activity },
  { label: "Requests", Icon: MessageCircle },
  { label: "Settings", Icon: Settings },
];
const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const calendarDays = [29, 30, 31, ...Array.from({ length: 30 }, (_, index) => index + 1), 1, 2];
function PreviewPhoto({ file, className = "" }: { file: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <BrandText><img
      src={`/coorda-template/${file}`}
      className={className}
      alt=""
      loading="lazy"
      draggable={false}
    /></BrandText>
  );
}
function CalendarPreview() {
  const { copyText } = useReferenceLocale();
  return (
    <BrandText><div className="desktop-calendar-column">
      <div className="desktop-calendar-card">
        <div className="desktop-calendar-heading">
          <strong>
            {copyText("March ")}
            <span>{copyText("2026")}</span>
          </strong>
          <span className="desktop-month">
            {copyText("Month ")}
            <ChevronDown size={10} />
          </span>
        </div>
        <div className="desktop-weekdays">
          {copyText(weekdays.map((day) => <span key={day}>{copyText(day)}</span>))}
        </div>
        <div className="desktop-calendar-grid">
          {copyText(
            calendarDays.map((day, index) => (
              <span
                key={index}
                className={`${index < 3 || index > 32 ? "calendar-muted" : ""}${index === 11 ? " calendar-selected" : ""}`}
              >
                {copyText(day)}
              </span>
            )),
          )}
        </div>
      </div>
      <div className="desktop-ai-insight">
        <strong>
          <Sparkles size={14} strokeWidth={1.5} />
          {copyText(" AI Insight")}
        </strong>
        <p>{copyText("A clearer view of your data helps you choose the next step.")}</p>
      </div>
    </div></BrandText>
  );
}
function EventsPreview() {
  const { copyText } = useReferenceLocale();
  return (
    <BrandText><div className="desktop-events-column">
      <div className="desktop-events-heading">
        <strong>{copyText("Friday, March 9")}</strong>
        <div>
          <span>
            <List size={13} />
          </span>
          <span className="desktop-view-selected">
            <Grid2X2 size={13} />
          </span>
        </div>
      </div>
      <div className="desktop-event-photo">
        <PreviewPhoto file="desktop-run.png" />
        <span>
          <Heart size={12} fill="currentColor" strokeWidth={1.5} />
        </span>
      </div>
      <div className="desktop-event-details">
        <div>
          <strong>{copyText("Project review")}</strong>
          <p>
            <CalendarDays size={10} />
            {copyText(" March 9 \u00B7 7:00 AM")}
          </p>
          <p>
            <MapPin size={10} />
            {copyText(" Runyon Canyon, LA")}
          </p>
        </div>
        <span>{copyText("Invited")}</span>
      </div>
      <div className="desktop-event-divider" />
      <div className="desktop-event-photo">
        <PreviewPhoto file="ai-mountain.png" />
        <span>
          <Heart size={12} fill="currentColor" strokeWidth={1.5} />
        </span>
      </div>
    </div></BrandText>
  );
}
function DesktopWindow() {
  const { copyText } = useReferenceLocale();
  const reduceMotion = useReducedMotion();
  return (
    <BrandText><motion.div
      className="desktop-app-window"
      initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="desktop-app-shell">
        <div className="desktop-window-titlebar">
          <span />
          <span />
          <span />
        </div>
        <div className="desktop-window-body">
          <div className="desktop-sidebar">
            <div>
              <PreviewPhoto file="rycode-black.svg" className="desktop-sidebar-logo" />
              <div className="desktop-sidebar-items">
                {copyText(
                  sidebar.map(({ label, Icon }, index) => (
                    <div key={label} className={index === 0 ? "desktop-sidebar-selected" : ""}>
                      <Icon size={12} strokeWidth={1.5} />
                      <span>{copyText(label)}</span>
                    </div>
                  )),
                )}
              </div>
            </div>
            <div className="desktop-sidebar-settings">
              <Settings size={12} strokeWidth={1.5} />
              {copyText(" Settings")}
            </div>
          </div>
          <div className="desktop-workspace">
            <div className="desktop-workspace-header">
              <div>
                <span className="desktop-workspace-selected">{copyText("Overview")}</span>
                <span>{copyText("Organization")}</span>
                <span>{copyText("Favorite")}</span>
              </div>
              <span className="desktop-new-event">
                <Plus size={10} />
                {copyText(" New request")}
              </span>
            </div>
            <div className="desktop-workspace-content">
              <CalendarPreview />
              <EventsPreview />
            </div>
            <div className="desktop-workspace-fade" />
          </div>
        </div>
      </div>
    </motion.div></BrandText>
  );
}
export default function DesktopApp() {
  const { copyText } = useReferenceLocale();
  const reduceMotion = useReducedMotion();
  return (
    <BrandText><section id="desktop-app" className="desktop-app-section" aria-labelledby="desktop-app-title">
      <div className="desktop-section-container">
        <motion.div
          className="desktop-section-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <h2 id="desktop-app-title">
            {copyText("Your workflow,")}
            <br />
            {copyText("one ")}
            <mark>{copyText("clear workspace")}</mark>
          </h2>
          <div className="desktop-members">
            <div className="desktop-members-avatars" aria-hidden="true">
              {copyText(
                [1, 2, 3, 4, 5].map((index) => (
                  <PreviewPhoto file={`desktop-avatar-${index}.png`} key={index} />
                )),
              )}
            </div>
            <p>{copyText("Concept interface preview")}</p>
          </div>
        </motion.div>

        <div className="desktop-scene" role="img" aria-label="Concept interface preview">
          <PreviewPhoto file="desktop-wallpaper.png" className="desktop-wallpaper" />
          <div className="desktop-scene-content" aria-hidden="true">
            <div className="desktop-mac-menu">
              <div>
                <strong>{copyText("RYCODE")}</strong>
                <span>{copyText("File")}</span>
                <span>{copyText("Edit")}</span>
                <span>{copyText("View")}</span>
                <span>{copyText("Window")}</span>
              </div>
              <div>
                <BatteryMedium size={18} strokeWidth={1.5} />
                <Wifi size={16} strokeWidth={1.5} />
                <Search size={16} strokeWidth={1.5} />
                <strong>{copyText("Fri 28 Mar 12:58")}</strong>
              </div>
            </div>
            <DesktopWindow />
          </div>
        </div>
      </div>
    </section></BrandText>
  );
}
