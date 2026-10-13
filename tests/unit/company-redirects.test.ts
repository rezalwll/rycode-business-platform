import { expect, it } from "vitest";
import nextConfig from "../../next.config";

it("permanently redirects merged company routes to localized about chapters before rendering", async () => {
  const redirects = await nextConfig.redirects!();
  expect(
    redirects.filter((rule) => /\/(why-rycode|process|technologies)$/.test(rule.source)),
  ).toHaveLength(9);
  for (const [source, anchor] of [
    ["why-rycode", "approach"],
    ["process", "process"],
    ["technologies", "technology"],
  ]) {
    for (const prefix of ["", "/fa", "/en"]) {
      expect(redirects).toContainEqual({
        source: `${prefix}/${source}`,
        destination: `${prefix === "/en" ? "/en" : ""}/about#${anchor}`,
        permanent: true,
      });
    }
  }
});

it("preserves legacy solution and industry links with a pre-render canonical redirect", async () => {
  const redirects = await nextConfig.redirects!();
  for (const kind of ["solutions", "industries"])
    for (const prefix of ["", "/fa", "/en"]) {
      expect(redirects).toContainEqual({
        source: `${prefix}/${kind}`,
        destination: `${prefix === "/en" ? "/en" : ""}/services#${kind}`,
        permanent: true,
      });
      expect(redirects).toContainEqual({
        source: `${prefix}/${kind}/:slug`,
        destination: `${prefix === "/en" ? "/en" : ""}/services/${kind}/:slug`,
        permanent: true,
      });
    }
});
