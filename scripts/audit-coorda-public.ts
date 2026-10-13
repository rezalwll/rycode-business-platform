import { allCatalogEntries, catalogPath } from "../src/content/catalog";

/** Read-only runtime audit; this is not a browser or visual verification. */
async function main() {
  const base = process.argv[2] ?? "http://127.0.0.1:3001";
  const publicPaths = [
    "/",
    "/services",
    "/projects",
    "/blog",
    "/problems",
    "/integrations",
    "/about",
    "/faq",
    "/terms",
    "/privacy",
    "/installment-purchase",
    "/start-project",
    "/technical-review",
    "/seo-audit",
    "/contact",
    "/search",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    ...allCatalogEntries().map((entry) => catalogPath(entry.kind, entry.slug)),
  ];
  const paths = [...new Set(publicPaths)].flatMap((path) => [
    path,
    path === "/" ? "/en" : `/en${path}`,
  ]);
  const reports: { path: string; status: number; shell: boolean; footer: boolean; h1: boolean }[] =
    [];
  const failures: string[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (cursor < paths.length) {
        const path = paths[cursor++]!;
        const response = await fetch(new URL(path, base), {
          redirect: "manual",
          signal: AbortSignal.timeout(60000),
        });
        const html = await response.text();
        const result = {
          path,
          status: response.status,
          shell: html.includes("rycode-coorda"),
          footer: html.includes('class="coorda-footer-wordmark"'),
          h1: /<h1[\s>]/.test(html),
        };
        reports.push(result);
        if (result.status !== 200 || !result.shell || !result.footer || !result.h1)
          failures.push(path);
      }
    }),
  );
  for (const [path, destination] of [
    ["/why-rycode?source=check", "/about?source=check#approach"],
    ["/en/technologies?tag=a&tag=b", "/en/about?tag=a&tag=b#technology"],
    ["/process", "/about#process"],
    ["/solutions", "/services#solutions"],
    ["/industries", "/services#industries"],
  ]) {
    const response = await fetch(new URL(path!, base), { redirect: "manual" });
    const location = response.headers.get("location");
    if (
      response.status !== 308 ||
      !(location === destination || location === new URL(destination!, base).href)
    )
      failures.push(`redirect: ${path} (${response.status}, ${location})`);
  }
  const assetReports = [];
  for (const path of [
    "/videos/rycode-hero.mp4",
    "/images/editorial/rycode-hero-poster.jpg",
    "/images/editorial/web-experience.png",
    "/images/editorial/data-dashboard.png",
    "/images/editorial/seo-growth-workspace.png",
  ]) {
    const response = await fetch(new URL(path, base), { method: "HEAD" });
    assetReports.push({
      path,
      status: response.status,
      type: response.headers.get("content-type"),
      bytes: response.headers.get("content-length"),
    });
    if (response.status !== 200) failures.push(path);
  }
  const range = await fetch(new URL("/videos/rycode-hero.mp4", base), {
    headers: { Range: "bytes=0-1023" },
  });
  if (range.status !== 206 || !range.headers.get("content-range"))
    failures.push("video byte range");
  await range.arrayBuffer();
  console.log(
    JSON.stringify(
      {
        pages: reports.length,
        passed: reports.filter((row) => row.status === 200 && row.shell && row.footer && row.h1)
          .length,
        assets: assetReports,
        videoRange: range.status,
        failures,
        results: process.argv.includes("--details")
          ? reports.sort((a, b) => a.path.localeCompare(b.path))
          : undefined,
      },
      null,
      2,
    ),
  );
  if (failures.length) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
