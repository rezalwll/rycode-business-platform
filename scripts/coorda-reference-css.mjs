import fs from "node:fs";
import postcss from "postcss";

// Print a scoped, otherwise unmodified copy of the supplied template stylesheet.
// The caller installs the generated result with apply_patch.
const stylesheet = fs.readFileSync(process.argv[2], "utf8");
const root = postcss.parse(stylesheet);
root.walkAtRules("import", rule => rule.remove());
root.walkDecls(declaration => {
  declaration.value = declaration.value.replaceAll("/reference/", "/coorda-template/");
});
root.walkRules(rule => {
  let parent = rule.parent;
  while(parent) {
    if(parent.type === "atrule" && /keyframes$/i.test(parent.name)) return;
    parent = parent.parent;
  }
  rule.selector = rule.selector.split(/,(?![^()]*\))/).map(selector => {
    const value=selector.trim();
    return value === ":root" || value === "html" || value === "body" ? ".coorda-reference" : `.coorda-reference ${value}`;
  }).join(", ");
});
process.stdout.write(root.toString());
