import "server-only";

import { createConnection } from "node:net";

export type MalwareScanResult = { verdict: "clean" } | { verdict: "infected"; signature: string };

export async function scanWithClamAv(
  stream: ReadableStream<Uint8Array>,
  options: { host: string; port: number; timeoutMs?: number },
): Promise<MalwareScanResult> {
  const timeoutMs = options.timeoutMs ?? 60_000;
  const socket = createConnection({ host: options.host, port: options.port });
  socket.setTimeout(timeoutMs);

  await new Promise<void>((resolve, reject) => {
    socket.once("connect", resolve);
    socket.once("error", reject);
  });

  const response = new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    socket.on("data", (chunk: Buffer) => chunks.push(chunk));
    socket.on("end", () => resolve(Buffer.concat(chunks).toString("utf8").replace(/\0+$/, "")));
    socket.on("timeout", () => socket.destroy(new Error("ClamAV scan timed out.")));
    socket.on("error", reject);
  });

  const write = async (chunk: Uint8Array) => {
    if (socket.write(chunk)) return;
    await new Promise<void>((resolve, reject) => {
      socket.once("drain", resolve);
      socket.once("error", reject);
    });
  };

  await write(Buffer.from("zINSTREAM\0"));
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const size = Buffer.allocUnsafe(4);
      size.writeUInt32BE(value.byteLength);
      await write(size);
      await write(value);
    }
    await write(Buffer.alloc(4));
    socket.end();
  } catch (error) {
    socket.destroy();
    throw error;
  } finally {
    reader.releaseLock();
  }

  const reply = await response;
  if (reply.endsWith(" OK")) return { verdict: "clean" };
  const infected = reply.match(/: (.+) FOUND$/);
  if (infected?.[1]) return { verdict: "infected", signature: infected[1] };
  throw new Error(`ClamAV returned an invalid or failed scan response: ${reply.slice(0, 240)}`);
}
