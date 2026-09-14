import "server-only";

import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { assertSafeObjectKey, resolveObjectPath } from "@/server/storage/keys";

export type StoredObject = {
  stream: ReadableStream<Uint8Array>;
  sizeBytes: number;
};

export class LocalPrivateStorage {
  readonly root: string;

  constructor(storageRoot: string) {
    this.root = path.resolve(storageRoot);
  }

  async put(objectKey: string, bytes: Uint8Array): Promise<void> {
    const safeKey = assertSafeObjectKey(objectKey);
    const destination = resolveObjectPath(this.root, safeKey);
    const directory = path.dirname(destination);
    const temporary = `${destination}.${randomUUID()}.uploading`;

    await mkdir(directory, { recursive: true, mode: 0o700 });
    try {
      await writeFile(temporary, bytes, { flag: "wx", mode: 0o600 });
      try {
        await stat(destination);
        throw new Error("A storage object with this key already exists.");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      await rename(temporary, destination);
    } catch (error) {
      await unlink(temporary).catch(() => undefined);
      throw error;
    }
  }

  async open(objectKey: string): Promise<StoredObject> {
    const objectPath = resolveObjectPath(this.root, objectKey);
    const details = await stat(objectPath);
    if (!details.isFile()) throw new Error("The storage object is not a regular file.");

    const nodeStream = createReadStream(objectPath);
    return {
      stream: Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>,
      sizeBytes: details.size,
    };
  }

  async remove(objectKey: string): Promise<void> {
    const objectPath = resolveObjectPath(this.root, objectKey);
    await unlink(objectPath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}
