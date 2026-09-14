export function normalizeRedirectSource(value: string): string | null {
  if (!value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/u.test(value)) {
    return null;
  }
  return value.split(/[?#]/u, 1)[0] ?? null;
}

export function normalizeRedirectDestination(value: string): string | null {
  if (!value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/u.test(value)) {
    return null;
  }
  try {
    const base = new URL("https://rycode.invalid");
    const destination = new URL(value, base);
    if (destination.origin !== base.origin) return null;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return null;
  }
}
