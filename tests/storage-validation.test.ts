import { describe, expect, it } from "vitest";

import {
  UnsafeStorageKeyError,
  assertSafeObjectKey,
  generateObjectKey,
  resolveObjectPath,
} from "../src/server/storage/keys";
import {
  requireCmsMediaImage,
  UploadValidationError,
  validateUpload,
} from "../src/server/storage/validation";

const encoder = new TextEncoder();

describe("private storage keys", () => {
  it("generates predictable normalized key segments without user file names", () => {
    expect(
      generateObjectKey(".PDF", {
        now: new Date("2026-09-08T00:00:00.000Z"),
        randomId: () => "123e4567-e89b-42d3-a456-426614174000",
      }),
    ).toBe("2026/09/123e4567-e89b-42d3-a456-426614174000.pdf");
  });

  it.each(["../secret.pdf", "safe/../../secret.pdf", "/etc/passwd", "C:\\secret", "a\\b.pdf"])(
    "rejects unsafe object key %s",
    (key) => expect(() => assertSafeObjectKey(key)).toThrow(UnsafeStorageKeyError),
  );

  it("resolves safe keys beneath the configured root", () => {
    const resolved = resolveObjectPath("C:\\app\\private", "2026/09/file.pdf");
    expect(resolved.toLowerCase()).toContain("app\\private\\2026\\09\\file.pdf");
  });
});

describe("private upload validation", () => {
  it("accepts PDF content only when extension, MIME and magic bytes agree", () => {
    const result = validateUpload({
      bytes: encoder.encode("%PDF-1.7\n%%EOF"),
      fileName: "proposal.pdf",
      declaredMimeType: "application/pdf",
    });
    expect(result).toEqual({ extension: "pdf", mimeType: "application/pdf", family: "document" });
  });

  it("normalizes jpeg extensions without weakening MIME checks", () => {
    const result = validateUpload({
      bytes: Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]),
      fileName: "photo.JPEG",
      declaredMimeType: "image/jpeg",
    });
    expect(result.extension).toBe("jpg");
  });

  it("rejects renamed executable content", () => {
    expect(() =>
      validateUpload({
        bytes: encoder.encode("MZ executable"),
        fileName: "invoice.pdf",
        declaredMimeType: "application/pdf",
      }),
    ).toThrowError(expect.objectContaining({ code: "signature_mismatch" }));
  });

  it("rejects path-bearing names and control bytes in text", () => {
    expect(() =>
      validateUpload({
        bytes: encoder.encode("safe"),
        fileName: "../safe.txt",
        declaredMimeType: "text/plain",
      }),
    ).toThrow(UploadValidationError);
    expect(() =>
      validateUpload({
        bytes: Uint8Array.from([0x61, 0x00, 0x62]),
        fileName: "notes.txt",
        declaredMimeType: "text/plain",
      }),
    ).toThrowError(expect.objectContaining({ code: "invalid_text" }));
  });

  it("enforces a byte limit independently of browser metadata", () => {
    expect(() =>
      validateUpload({
        bytes: encoder.encode("%PDF-1.7"),
        fileName: "large.pdf",
        declaredMimeType: "application/pdf",
        maxBytes: 4,
      }),
    ).toThrowError(expect.objectContaining({ code: "file_too_large" }));
  });

  it("restricts CMS media to validated image families", () => {
    const image = validateUpload({
      bytes: Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]),
      fileName: "cover.jpg",
      declaredMimeType: "image/jpeg",
    });
    const document = validateUpload({
      bytes: encoder.encode("%PDF-1.7\n%%EOF"),
      fileName: "cover.pdf",
      declaredMimeType: "application/pdf",
    });

    expect(() => requireCmsMediaImage(image)).not.toThrow();
    expect(() => requireCmsMediaImage(document)).toThrowError(
      expect.objectContaining({ code: "unsupported_extension" }),
    );
  });
});
