import fs from "node:fs";
import ts from "typescript";

// Keep the supplied JSX tree and behavior. Localize only text and destinations.
const sourcePath = process.argv[2];
const options = process.argv[3]
  ? (JSON.parse(fs.readFileSync(process.argv[3], "utf8"))[sourcePath.split(/[\\/]/).at(-1)] ?? {})
  : {};
let source = fs.readFileSync(sourcePath, "utf8").replaceAll("/reference/", "/coorda-template/");
for (const [before, after] of options.replacements ?? []) source = source.replaceAll(before, after);
const before = ts.createSourceFile(
  sourcePath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const edits = [];
function collect(node) {
  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.initializer &&
    options.variables?.[node.name.text]
  )
    edits.push({
      start: node.initializer.getStart(before),
      end: node.initializer.end,
      value: options.variables[node.name.text],
    });
  ts.forEachChild(node, collect);
}
collect(before);
for (const edit of edits.sort((a, b) => b.start - a.start))
  source = source.slice(0, edit.start) + edit.value + source.slice(edit.end);
const file = ts.createSourceFile(
  sourcePath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const f = ts.factory;
const textCall = (value) =>
  f.createCallExpression(f.createIdentifier("copyText"), undefined, [value]);
const jsx = (expression) => f.createJsxExpression(undefined, expression);
const normalize = (value) => {
  const lines = value.split(/\r\n|\n|\r/);
  const last = lines.findLastIndex((line) => line.trim().length);
  return lines
    .map((line, i) => {
      let s = line.replaceAll("\t", " ");
      if (i !== 0) s = s.replace(/^ +/, "");
      if (i !== lines.length - 1) s = s.replace(/ +$/, "");
      return s + (s && i !== last ? " " : "");
    })
    .join("")
    .replaceAll("&apos;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ");
};
const transformed = ts.transform(file, [
  (context) => {
    let owner = null;
    const visit = (node) => {
      if (
        ts.isFunctionDeclaration(node) &&
        node.name &&
        /^[A-Z]/.test(node.name.text) &&
        node.body
      ) {
        const previous = owner;
        const current = { copy: false, href: false };
        owner = current;
        const updated = ts.visitEachChild(node, visit, context);
        owner = previous;
        if (!current.copy && !current.href) return updated;
        const names = [...(current.copy ? ["copyText"] : []), ...(current.href ? ["href"] : [])];
        const declaration = f.createVariableStatement(
          undefined,
          f.createVariableDeclarationList(
            [
              f.createVariableDeclaration(
                f.createObjectBindingPattern(
                  names.map((name) => f.createBindingElement(undefined, undefined, name)),
                ),
                undefined,
                undefined,
                f.createCallExpression(f.createIdentifier("useReferenceLocale"), undefined, []),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        );
        return f.updateFunctionDeclaration(
          updated,
          updated.modifiers,
          updated.asteriskToken,
          updated.name,
          updated.typeParameters,
          updated.parameters,
          updated.type,
          f.updateBlock(updated.body, [declaration, ...updated.body.statements]),
        );
      }
      if (owner && ts.isJsxText(node) && node.text.trim()) {
        owner.copy = true;
        return jsx(textCall(f.createStringLiteral(normalize(node.text))));
      }
      if (
        owner &&
        ts.isJsxExpression(node) &&
        node.expression &&
        !ts.isJsxAttribute(node.parent) &&
        !ts.isJsxSpreadAttribute(node.parent)
      ) {
        owner.copy = true;
        return f.updateJsxExpression(node, textCall(ts.visitNode(node.expression, visit)));
      }
      if (owner && ts.isJsxAttribute(node) && node.name.text === "href" && node.initializer) {
        owner.href = true;
        const value = ts.isStringLiteral(node.initializer)
          ? f.createStringLiteral(node.initializer.text)
          : node.initializer.expression;
        return f.updateJsxAttribute(
          node,
          node.name,
          jsx(f.createCallExpression(f.createIdentifier("href"), undefined, [value])),
        );
      }
      // The receiving project enables exact optional properties, unlike the clone.
      if (
        ts.isJsxAttribute(node) &&
        node.initializer &&
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression &&
        ts.isConditionalExpression(node.initializer.expression)
      ) {
        const value = node.initializer.expression;
        const empty = (part) => ts.isIdentifier(part) && part.text === "undefined";
        if (empty(value.whenTrue) || empty(value.whenFalse)) {
          const filled = (part) =>
            empty(part)
              ? f.createObjectLiteralExpression()
              : f.createObjectLiteralExpression([
                  f.createPropertyAssignment(
                    f.createStringLiteral(node.name.text),
                    ts.visitNode(part, visit),
                  ),
                ]);
          return f.createJsxSpreadAttribute(
            f.updateConditionalExpression(
              value,
              value.condition,
              value.questionToken,
              filled(value.whenTrue),
              value.colonToken,
              filled(value.whenFalse),
            ),
          );
        }
      }
      if (
        ts.isElementAccessExpression(node) &&
        !ts.isNonNullExpression(node.parent) &&
        !(ts.isBinaryExpression(node.parent) && node.parent.left === node)
      )
        return f.createNonNullExpression(ts.visitEachChild(node, visit, context));
      return ts.visitEachChild(node, visit, context);
    };
    return (root) => ts.visitNode(root, visit);
  },
]);
const output = ts
  .createPrinter({ newLine: ts.NewLineKind.LineFeed })
  .printFile(transformed.transformed[0]);
process.stdout.write(
  output.replace(
    /("use client";)/,
    '$1\n\nimport { useReferenceLocale } from "./reference-locale";',
  ),
);
