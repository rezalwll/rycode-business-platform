import { createServer, type Server } from "node:net";

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { scanWithClamAv } from "@/server/storage/clamav";

const servers: Server[] = [];

afterEach(async () => {
  await Promise.all(
    servers
      .splice(0)
      .map((server) => new Promise<void>((resolve) => server.close(() => resolve()))),
  );
});

async function fakeClamAv(reply: string): Promise<{ port: number; received: () => Buffer }> {
  let received = Buffer.alloc(0);
  const server = createServer((socket) => {
    let buffer = Buffer.alloc(0);
    let commandRead = false;
    socket.on("data", (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
      if (!commandRead) {
        const terminator = buffer.indexOf(0);
        if (terminator < 0) return;
        expect(buffer.subarray(0, terminator).toString()).toBe("zINSTREAM");
        buffer = buffer.subarray(terminator + 1);
        commandRead = true;
      }
      while (buffer.length >= 4) {
        const length = buffer.readUInt32BE(0);
        if (buffer.length < 4 + length) return;
        buffer = buffer.subarray(4);
        if (length === 0) {
          socket.end(`${reply}\0`);
          return;
        }
        received = Buffer.concat([received, buffer.subarray(0, length)]);
        buffer = buffer.subarray(length);
      }
    });
  });
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Fake ClamAV did not bind.");
  return { port: address.port, received: () => received };
}

describe("ClamAV INSTREAM client", () => {
  it("streams bytes and accepts only an explicit clean verdict", async () => {
    const daemon = await fakeClamAv("stream: OK");
    const bytes = new TextEncoder().encode("safe document");
    const result = await scanWithClamAv(new Blob([bytes]).stream(), {
      host: "127.0.0.1",
      port: daemon.port,
    });
    expect(result).toEqual({ verdict: "clean" });
    expect(daemon.received()).toEqual(Buffer.from(bytes));
  });

  it("returns the malware signature from a FOUND verdict", async () => {
    const daemon = await fakeClamAv("stream: Eicar-Signature FOUND");
    await expect(
      scanWithClamAv(new Blob(["infected"]).stream(), {
        host: "127.0.0.1",
        port: daemon.port,
      }),
    ).resolves.toEqual({ verdict: "infected", signature: "Eicar-Signature" });
  });

  it("fails closed on scanner errors", async () => {
    const daemon = await fakeClamAv("stream: scan limit exceeded ERROR");
    await expect(
      scanWithClamAv(new Blob(["unknown"]).stream(), {
        host: "127.0.0.1",
        port: daemon.port,
      }),
    ).rejects.toThrow("invalid or failed scan response");
  });
});
