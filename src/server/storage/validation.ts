const MEBIBYTE = 1024 * 1024;

export const DEFAULT_MAX_UPLOAD_BYTES = 20 * MEBIBYTE;
export const MAX_ORIGINAL_FILE_NAME_LENGTH = 240;

export type ValidatedFileType = {
  extension: "pdf" | "png" | "jpg" | "gif" | "webp" | "zip" | "txt" | "md" | "csv";
  mimeType: string;
  family: "document" | "image" | "archive" | "text";
};

export type UploadValidationInput = {
  bytes: Uint8Array;
  fileName: string;
  declaredMimeType: string;
  maxBytes?: number;
};

export class UploadValidationError extends Error {
  override readonly name = "UploadValidationError";

  constructor(
    readonly code:
      | "empty_file"
      | "file_too_large"
      | "invalid_name"
      | "unsupported_extension"
      | "mime_mismatch"
      | "signature_mismatch"
      | "invalid_text",
    message: string,
  ) {
    super(message);
  }
}

type FileRule = ValidatedFileType & {
  acceptedMimeTypes: readonly string[];
  hasValidSignature: (bytes: Uint8Array) => boolean;
};

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((value, index) => bytes[index] === value);
}

function hasAscii(bytes: Uint8Array, offset: number, value: string): boolean {
  return Array.from(value).every(
    (character, index) => bytes[offset + index] === character.charCodeAt(0),
  );
}

function isValidUtf8Text(bytes: Uint8Array): boolean {
  try {
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    for (const character of decoded) {
      const codePoint = character.codePointAt(0) ?? 0;
      if (codePoint === 0 || (codePoint < 32 && ![9, 10, 13].includes(codePoint))) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

const rules: Readonly<Record<string, FileRule>> = {
  pdf: {
    extension: "pdf",
    mimeType: "application/pdf",
    family: "document",
    acceptedMimeTypes: ["application/pdf"],
    hasValidSignature: (bytes) => hasAscii(bytes, 0, "%PDF-"),
  },
  png: {
    extension: "png",
    mimeType: "image/png",
    family: "image",
    acceptedMimeTypes: ["image/png"],
    hasValidSignature: (bytes) =>
      startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  jpg: {
    extension: "jpg",
    mimeType: "image/jpeg",
    family: "image",
    acceptedMimeTypes: ["image/jpeg"],
    hasValidSignature: (bytes) => startsWith(bytes, [0xff, 0xd8, 0xff]),
  },
  jpeg: {
    extension: "jpg",
    mimeType: "image/jpeg",
    family: "image",
    acceptedMimeTypes: ["image/jpeg"],
    hasValidSignature: (bytes) => startsWith(bytes, [0xff, 0xd8, 0xff]),
  },
  gif: {
    extension: "gif",
    mimeType: "image/gif",
    family: "image",
    acceptedMimeTypes: ["image/gif"],
    hasValidSignature: (bytes) => hasAscii(bytes, 0, "GIF87a") || hasAscii(bytes, 0, "GIF89a"),
  },
  webp: {
    extension: "webp",
    mimeType: "image/webp",
    family: "image",
    acceptedMimeTypes: ["image/webp"],
    hasValidSignature: (bytes) =>
      bytes.length >= 12 && hasAscii(bytes, 0, "RIFF") && hasAscii(bytes, 8, "WEBP"),
  },
  zip: {
    extension: "zip",
    mimeType: "application/zip",
    family: "archive",
    acceptedMimeTypes: ["application/zip", "application/x-zip-compressed"],
    hasValidSignature: (bytes) =>
      startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
      startsWith(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
      startsWith(bytes, [0x50, 0x4b, 0x07, 0x08]),
  },
  txt: {
    extension: "txt",
    mimeType: "text/plain",
    family: "text",
    acceptedMimeTypes: ["text/plain"],
    hasValidSignature: isValidUtf8Text,
  },
  md: {
    extension: "md",
    mimeType: "text/markdown",
    family: "text",
    acceptedMimeTypes: ["text/markdown", "text/plain"],
    hasValidSignature: isValidUtf8Text,
  },
  csv: {
    extension: "csv",
    mimeType: "text/csv",
    family: "text",
    acceptedMimeTypes: ["text/csv", "text/plain"],
    hasValidSignature: isValidUtf8Text,
  },
};

function extractExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex < 0 ? "" : fileName.slice(dotIndex + 1).toLowerCase();
}

export function validateUpload(input: UploadValidationInput): ValidatedFileType {
  const maxBytes = input.maxBytes ?? DEFAULT_MAX_UPLOAD_BYTES;
  if (input.bytes.byteLength === 0) {
    throw new UploadValidationError("empty_file", "Empty files are not accepted.");
  }
  if (input.bytes.byteLength > maxBytes) {
    throw new UploadValidationError("file_too_large", `Files may not exceed ${maxBytes} bytes.`);
  }

  const fileName = input.fileName.trim();
  if (
    fileName.length === 0 ||
    fileName.length > MAX_ORIGINAL_FILE_NAME_LENGTH ||
    /[\u0000-\u001f\u007f]/.test(fileName) ||
    fileName.includes("/") ||
    fileName.includes("\\")
  ) {
    throw new UploadValidationError("invalid_name", "The original file name is invalid.");
  }

  const extension = extractExtension(fileName);
  const rule = rules[extension];
  if (!rule) {
    throw new UploadValidationError(
      "unsupported_extension",
      "Only PDF, PNG, JPEG, GIF, WebP, ZIP and UTF-8 text files are accepted.",
    );
  }

  const declaredMimeType = input.declaredMimeType.split(";", 1)[0]?.trim().toLowerCase() ?? "";
  if (!rule.acceptedMimeTypes.includes(declaredMimeType)) {
    throw new UploadValidationError(
      "mime_mismatch",
      "The declared MIME type does not match the extension.",
    );
  }

  if (!rule.hasValidSignature(input.bytes)) {
    throw new UploadValidationError(
      rule.family === "text" ? "invalid_text" : "signature_mismatch",
      "The file content does not match its declared type.",
    );
  }

  return { extension: rule.extension, mimeType: rule.mimeType, family: rule.family };
}

export function requireCmsMediaImage(fileType: ValidatedFileType): void {
  if (fileType.family !== "image") {
    throw new UploadValidationError("unsupported_extension", "CMS media must be an image.");
  }
}
