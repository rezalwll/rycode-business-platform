import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Code2,
  Database,
  Gauge,
  LifeBuoy,
  Network,
  Search,
  ShoppingCart,
  Workflow,
} from "lucide-react";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { Container, MetaLabel } from "@/components/site/primitives";

const capabilities = [
  {
    title: "Web platforms",
    text: "Fast, accessible and content-ready corporate and commerce experiences.",
    icon: Code2,
  },
  {
    title: "Custom software",
    text: "Operational tools shaped around the way your team actually works.",
    icon: Workflow,
  },
  {
    title: "Project rescue",
    text: "A measured route out of stalled, fragile or slow software projects.",
    icon: LifeBuoy,
  },
  {
    title: "Search growth",
    text: "Technical SEO, information architecture and conversion-aware content systems.",
    icon: Search,
  },
  {
    title: "Performance",
    text: "Core Web Vitals, observability and incremental engineering improvement.",
    icon: Gauge,
  },
] as const;

const paths = [
  {
    index: "01",
    title: "Build something new",
    text: "Shape the scope, architecture and first dependable release.",
    href: "/start-project",
  },
  {
    index: "02",
    title: "Fix a troubled product",
    text: "Inspect the evidence before choosing repair, rescue or partial rebuild.",
    href: "/technical-review",
  },
  {
    index: "03",
    title: "Improve visibility",
    text: "Find technical and content constraints that limit qualified search demand.",
    href: "/seo-audit",
  },
] as const;

const services = [
  {
    title: "Web platforms",
    text: "Corporate, editorial and transactional experiences built for speed and accessibility.",
    icon: Code2,
  },
  {
    title: "Ecommerce systems",
    text: "Catalogues, checkout flows and operational integrations without hidden ownership.",
    icon: ShoppingCart,
  },
  {
    title: "Custom software",
    text: "Internal tools and client portals shaped around real roles and workflows.",
    icon: Workflow,
  },
  {
    title: "Systems integration",
    text: "Explicit, observable connections between APIs, data stores and business processes.",
    icon: Network,
  },
  {
    title: "Technical SEO",
    text: "Rendering, information architecture, migrations and measurable search foundations.",
    icon: Search,
  },
] as const;

const solutions = [
  [
    "Client operations",
    "Portals, projects, files, support and finance in one permission-aware workspace.",
  ],
  [
    "Content operations",
    "Bilingual publishing, structured content, media and discoverability without platform lock-in.",
  ],
  [
    "Business automation",
    "Replace repetitive hand-offs with auditable workflows and clear exception paths.",
  ],
  [
    "Data foundations",
    "Model operational data so reporting and future integrations remain trustworthy.",
  ],
] as const;

const industries = [
  "Professional services",
  "Retail and commerce",
  "Education",
  "Property",
  "Healthcare operations",
  "Industrial services",
] as const;
const principles = [
  [
    "Problem before tool",
    "Architecture follows the operating problem, constraints and success criteria.",
  ],
  [
    "Security by design",
    "Identity, access, auditability and recovery are part of the first design.",
  ],
  [
    "Reviewable delivery",
    "Small, runnable increments keep risk visible and decisions evidence-led.",
  ],
  [
    "Transferable ownership",
    "Code, accounts and documentation remain usable beyond one person or vendor.",
  ],
] as const;
const stages = ["Discover", "Define", "Design", "Build", "Test", "Launch", "Improve"] as const;
const commonQuestions = [
  [
    "Can you continue an existing project?",
    "Yes. We first inspect runtime viability, security, architecture and access ownership, then recommend continuation, targeted correction or partial rebuilding.",
  ],
  [
    "How are cost and timing determined?",
    "After scope, risk, dependencies and acceptance criteria are understood. High-uncertainty work can begin with a bounded assessment.",
  ],
  [
    "Who owns the code and accounts?",
    "Ownership and access are explicit. Operational accounts and the final repository should not depend on hidden personal access.",
  ],
  [
    "Is support available after launch?",
    "Yes. Support scope, response expectations and infrastructure responsibility are defined separately and measurably.",
  ],
] as const;

export function EnglishHome() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-border py-20 sm:py-28">
        <div className="grid-field absolute inset-0 opacity-40 [mask-image:radial-gradient(75%_80%_at_100%_0%,black,transparent)]" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
            <div>
              <MetaLabel index={1}>RYCODE / SOFTWARE ENGINEERING</MetaLabel>
              <h1 className="display-1 mt-12 max-w-[13ch]">
                From idea to execution. From problem to <span className="text-brand">solution</span>
              </h1>
              <p className="mt-10 max-w-xl text-lg leading-8 text-muted-foreground">
                RYCODE designs, builds and improves web platforms, ecommerce systems, custom
                software and integrations for organisations that need a dependable technical
                partner.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/start-project"
                  className="inline-flex h-12 items-center gap-3 rounded-[6px] bg-brand px-7 text-sm font-bold text-brand-foreground"
                >
                  Start a project <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-12 items-center rounded-[6px] border border-foreground/25 px-7 text-sm font-bold"
                >
                  Explore services
                </Link>
              </div>
            </div>
            <div className="visual-card relative overflow-hidden bg-ink p-3 text-white">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.9rem]">
                <Image
                  src="/images/rycode-hero-structure.png"
                  alt="Abstract connected product architecture"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <MetaLabel className="text-brand">BUILD / RESCUE / GROW</MetaLabel>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/70">
                    A visual system for the decisions behind the product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <MetaLabel>CAPABILITIES / 05</MetaLabel>
          <h2 className="display-2 mt-7 max-w-3xl">Engineering outcomes, not technology theatre</h2>
          <div className="mt-14 border-t border-border">
            {capabilities.map((item, index) => (
              <article
                key={item.title}
                className="grid gap-5 border-b border-border py-9 md:grid-cols-[5rem_1fr_1.2fr] md:items-start"
              >
                <MetaLabel index={index + 1} className="text-muted-foreground" />
                <div className="flex items-center gap-3 text-xl font-bold">
                  <item.icon className="size-5 text-brand" aria-hidden />
                  <h3>{item.title}</h3>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <Container>
          <MetaLabel>STARTING POINT / 03</MetaLabel>
          <h2 className="display-2 mt-7 max-w-3xl">Start from the situation you have today</h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
            {paths.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className="group bg-background p-7 transition-colors hover:bg-brand-soft sm:p-9"
              >
                <MetaLabel className="text-brand">{path.index}</MetaLabel>
                <h3 className="mt-10 text-2xl font-bold">{path.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{path.text}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold">
                  Discuss this path{" "}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <MetaLabel>SERVICES / 05</MetaLabel>
              <h2 className="display-2 mt-7 max-w-3xl">
                One engineering partner across the product lifecycle
              </h2>
            </div>
            <Link href="/services" className="text-sm font-bold text-brand hover:underline">
              Explore all services
            </Link>
          </div>
          <div className="mt-14 border-t border-border">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="grid gap-5 border-b border-border py-9 md:grid-cols-[5rem_1fr_1.2fr] md:items-start"
              >
                <MetaLabel index={index + 1} className="text-muted-foreground" />
                <div className="flex items-center gap-3 text-xl font-bold">
                  <service.icon className="size-5 text-brand" aria-hidden />
                  <h3>{service.title}</h3>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{service.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-soft py-16 sm:py-20">
        <Container>
          <MetaLabel>SOLUTIONS / OPERATIONS</MetaLabel>
          <h2 className="display-2 mt-7 max-w-3xl">Connect the product to the work around it</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {solutions.map(([title, text], index) => (
              <article key={title} className="border border-border bg-background p-7 sm:p-9">
                <div className="flex items-center justify-between gap-4">
                  <MetaLabel index={index + 1} />
                  <Database className="size-5 text-brand" aria-hidden />
                </div>
                <h3 className="mt-9 text-2xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <MetaLabel className="text-brand">PROJECT RESCUE</MetaLabel>
              <h2 className="display-2 mt-7 max-w-[14ch]">
                A stalled product needs evidence before another rewrite
              </h2>
            </div>
            <div>
              <p className="text-base leading-8 text-muted-foreground dark:text-white/70">
                We inspect the running system, code, data, security and deployment path. The result
                is a bounded recommendation: continue, repair deliberately, or rebuild only what the
                evidence justifies.
              </p>
              <Link
                href="/technical-review"
                className="mt-8 inline-flex h-12 items-center gap-3 rounded-[6px] bg-brand px-7 text-sm font-bold text-brand-foreground"
              >
                Request a technical review <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <MetaLabel>SELECTED DIRECTIONS / CONCEPTS</MetaLabel>
          <h2 className="display-2 mt-7 max-w-3xl">
            Examples of the problems the platform is designed to solve
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            These are transparent concept briefs, not invented client claims or fabricated outcomes.
          </p>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              [
                "B2B client portal",
                "Projects, approvals, files, support and finance with explicit tenant boundaries.",
              ],
              [
                "Editorial platform",
                "Bilingual structured publishing with media, taxonomy, workflow and search metadata.",
              ],
              [
                "Operational automation",
                "A traceable workflow replacing spreadsheets, inbox hand-offs and unclear ownership.",
              ],
            ].map(([title, text], index) => (
              <article
                key={title}
                className="relative overflow-hidden border border-border bg-surface p-7 sm:p-9"
              >
                <div className="grid-field absolute inset-0 opacity-20" />
                <div className="relative">
                  <MetaLabel className="text-brand">
                    CONCEPT {String(index + 1).padStart(2, "0")}
                  </MetaLabel>
                  <h3 className="mt-12 text-2xl font-bold">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <MetaLabel>INDUSTRIES / CONTEXT</MetaLabel>
              <h2 className="display-2 mt-7">Industry context changes the right answer</h2>
            </div>
            <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
              {industries.map((industry, index) => (
                <div key={industry} className="flex items-center gap-4 bg-background p-5">
                  <Building2 className="size-5 text-brand" aria-hidden />
                  <span className="font-bold">{industry}</span>
                  <MetaLabel className="ms-auto text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </MetaLabel>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <MetaLabel>WHY RYCODE / PRINCIPLES</MetaLabel>
          <h2 className="display-2 mt-7 max-w-3xl">Engineering should reduce uncertainty</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {principles.map(([title, text]) => (
              <article key={title} className="border-t border-border pt-6">
                <CheckCircle2 className="size-5 text-brand" aria-hidden />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <MetaLabel>PROCESS / 07</MetaLabel>
              <h2 className="display-2 mt-7">A clear path through every project</h2>
            </div>
            <Link href="/process" className="text-sm font-bold text-brand hover:underline">
              See the process
            </Link>
          </div>
          <ol className="mt-14 border-t border-border">
            {stages.map((stage, index) => (
              <li
                key={stage}
                className="flex items-baseline gap-6 border-b border-border py-7 sm:gap-12"
              >
                <span className="text-3xl font-extrabold text-foreground/15 sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-xl font-bold sm:text-2xl">{stage}</span>
                <MetaLabel className="text-muted-foreground">RYCODE</MetaLabel>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-brand-soft py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <h2 className="display-2 max-w-[14ch]">
              Commercial milestones can follow delivery milestones
            </h2>
            <div>
              <p className="text-base leading-8 text-muted-foreground">
                For suitable projects, scope and payment can be divided into explicit stages. Each
                stage has a reviewable output and agreed acceptance point before the next
                commitment.
              </p>
              <Link
                href="/start-project"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
              >
                Discuss an engagement <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <MetaLabel>JOURNAL</MetaLabel>
              <h2 className="display-2 mt-7 max-w-3xl">
                Notes on building, operating and improving digital products
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-bold text-brand hover:underline">
              View the journal
            </Link>
          </div>
          <div className="mt-14 border-y border-dashed border-border py-14">
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              No English article has been published yet. Approved bilingual CMS articles will appear
              here after publication.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <Container>
          <MetaLabel>FAQ / 04</MetaLabel>
          <h2 className="display-2 mt-7">Common questions before starting</h2>
          <div className="mt-14 border-t border-border">
            {commonQuestions.map(([question, answer]) => (
              <details key={question} className="group border-b border-border py-7">
                <summary className="cursor-pointer list-none text-xl font-bold marker:hidden group-open:text-brand sm:text-2xl">
                  {question}
                </summary>
                <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
          <Link
            href="/faq"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
          >
            Read all questions <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Container>
      </section>

      <section className="bg-surface py-16 text-foreground dark:bg-ink dark:text-ink-foreground sm:py-20">
        <Container>
          <MetaLabel className="text-brand">START HERE</MetaLabel>
          <h2 className="display-2 mt-7 max-w-3xl">
            Tell us what should be built, fixed or improved
          </h2>
          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-9 dark:border-white/12">
            <Link
              href="/start-project"
              className="inline-flex h-12 items-center gap-3 rounded-[6px] bg-brand px-7 text-sm font-bold text-brand-foreground"
            >
              Start a project <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/technical-review"
              className="inline-flex h-12 items-center rounded-[6px] border border-border px-7 text-sm font-bold dark:border-white/25"
            >
              Request a technical review
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
