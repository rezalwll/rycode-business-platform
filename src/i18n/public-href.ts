import type { Locale } from './routing';

export function localizedHref(locale: Locale, path: string): string {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return locale === 'en' ? `/en${normalized}` : normalized || '/';
}
