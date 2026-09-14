# RYCODE design system specification

## Brand tokens

- Graphite: the primary operating surface and high-contrast text.
- Warm ivory: the default public background and calm workspace canvas.
- RYCODE orange: brand, primary actions and selected/attention states only.
- Semantic green, amber, red and blue are restrained and reserved for status meaning.

## Typography

IranYekan is the primary Persian font and is loaded locally. Space Grotesk is used for English, technical metadata and the RYCODE wordmark. Display, heading, body, label, metadata, data and code roles use weight, spacing and grouping before increasing size.

## Density modes

- Public: low-to-medium density, editorial rhythm, large imagery and generous whitespace.
- Customer: medium density, clear context, action-first panels and calm tables.
- Admin: medium-to-high density, compact tables, grouped navigation and explicit next actions.

## Layout

Use a shared container and border language. Prefer section rules, split layouts, timelines, lists and tables. A card must represent a real conceptual group; do not wrap every line in a card.

## Components

Shared workspace primitives include PortalShell, PortalHeader, MetricCard, DataTable, EmptyPortalState, status badges, action feedback, timeline rows and contextual primary actions. Public primitives include PageHero, SectionHeader, visual cards and editorial indexes.

## Status conventions

Status color follows meaning, not entity: success = completed/paid/approved, warning = waiting/needs attention, danger = overdue/blocked/rejected, info = in progress/neutral. The same treatment applies to projects, leads, tickets, invoices, milestones and content.

## Interaction and accessibility

Every screen has one primary action, visible focus, keyboard-accessible controls, labels and meaningful loading, empty, error, unauthorized and not-found states. Motion is short and functional in workspaces; reduced motion is respected globally. Drag-and-drop is never the only state-change mechanism.

## RTL/LTR

Persian is designed first. Direction-sensitive navigation, breadcrumbs, chevrons, tables, steppers and timelines use logical CSS properties. English switches the typography and layout direction through the existing locale system. Mixed technical strings use explicit LTR containers.
