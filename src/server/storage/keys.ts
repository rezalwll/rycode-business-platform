import { randomUUID } from "node:crypto";
import path from "node:path";

const EXTENSION_PATTERN = /^[a-z0-9]{1,10}$/;

export class UnsafeStorageKeyError extends Error {
  override readonly name = "UnsafeStorageKeyError";
}

export function normalizeExtension(extension: string): string {
  const normalized = extension.trim().toLowerCase().replace(/^\./, "");
  if (!EXTENSION_PATTERN.test(normalized)) {
    throw new UnsafeStorageKeyError("The file extension is not safe for storage.");
  }
  return normalized;
}

/**
 * Object keys are intentionally narrower than arbitrary POSIX paths. Persisted
 * keys must already be normalized so an attacker cannot smuggle traversal or
 * platform-specific separators into the storage adapter.
 */
export function assertSafeObjectKey(objectKey: string): string {
  if (
    objectKey.length === 0 ||
    objectKey.length > 500 ||
    objectKey.includes("\\") ||
    objectKey.includes("\0") ||
    objectKey.startsWith("/") ||
    /^[a-zA-Z]:/.test(objectKey)
  ) {
    throw new UnsafeStorageKeyError("The object key is not a safe relative path.");
  }

  const segments = objectKey.split("/");
  if (
    segments.some(
      (segment) =>
        segment.length === 0 ||
        segment === "." ||
        segment === ".." ||
        !/^[a-zA-Z0-9._-]+$/.test(segment),
    )
  ) {
    throw new UnsafeStorageKeyError("The object key contains an unsafe path segment.");
  }

  const normalized = path.posix.normalize(objectKey);
  if (normalized !== objectKey) {
    throw new UnsafeStorageKeyError("The object key must already be normalized.");
  }

  return objectKey;
}

export type GeneratedObjectKeyOptions = {
  now?: Date;
  randomId?: () => string;
};

export function generateObjectKey(
  extension: string,
  options: GeneratedObjectKeyOptions = {},
): string {
  const safeExtension = normalizeExtension(extension);
  const now = options.now ?? new Date();
  const id = (options.randomId ?? randomUUID)().toLowerCase();

  if (!/^[a-z0-9-]{16,80}$/.test(id)) {
    throw new UnsafeStorageKeyError("The generated object identifier is invalid.");
  }

  const year = String(now.getUTCFullYear()).padStart(4, "0");
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return assertSafeObjectKey(`${year}/${month}/${id}.${safeExtension}`);
}

export function resolveObjectPath(storageRoot: string, objectKey: string): string {
  const safeKey = assertSafeObjectKey(objectKey);
  const absoluteRoot = path.resolve(storageRoot);
  const absoluteObjectPath = path.resolve(absoluteRoot, ...safeKey.split("/"));
  const relative = path.relative(absoluteRoot, absoluteObjectPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new UnsafeStorageKeyError("The object key resolves outside private storage.");
  }

  return absoluteObjectPath;
}
