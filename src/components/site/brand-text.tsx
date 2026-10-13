import { cloneElement, isValidElement, type ReactNode } from "react";

// Match the brand, not longer words. Preserve spelling, whitespace and punctuation.
const brandPattern = /(?<![\p{L}\p{N}_])(?:رای[\u200c\u200d -]?کد|rycode)(?![\p{L}\p{N}_])/giu;
const plainTextElements = new Set([
  "script",
  "style",
  "textarea",
  "input",
  "select",
  "option",
  "svg",
  "title",
]);

export function colorBrandText(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    const matches = [...node.matchAll(brandPattern)];
    if (!matches.length) return node;
    const parts: ReactNode[] = [];
    let offset = 0;
    for (const match of matches) {
      if (match.index > offset) parts.push(node.slice(offset, match.index));
      parts.push(
        <span className="rycode-brand-name" key={match.index}>
          {match[0]}
        </span>,
      );
      offset = match.index + match[0].length;
    }
    if (offset < node.length) parts.push(node.slice(offset));
    return parts;
  }
  if (Array.isArray(node)) {
    const children = node.map(colorBrandText);
    return children.some((child, index) => child !== node[index]) ? children : node;
  }
  if (
    !isValidElement<{
      children?: ReactNode;
      className?: string;
      contentEditable?: boolean | string;
    }>(node)
  ) {
    return node;
  }
  // Do not mutate values, attributes, rich-text editors or already styled brand names.
  if (
    (typeof node.type === "string" && plainTextElements.has(node.type)) ||
    node.props.contentEditable ||
    node.props.className?.split(/\s+/).includes("rycode-brand-name")
  )
    return node;
  const children = colorBrandText(node.props.children);
  return children === node.props.children ? node : cloneElement(node, { children });
}

/** Adds no layout wrapper. It only colors brand names in this rendered text tree. */
export function BrandText({ children }: { children: ReactNode }) {
  return <>{colorBrandText(children)}</>;
}
