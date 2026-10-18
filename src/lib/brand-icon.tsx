import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND_MARK_HEIGHT, BRAND_MARK_SRC, BRAND_MARK_WIDTH } from "./brand";

/** Square browser/mobile canvas; the original PNG's shape and gradient stay intact. */
export async function createBrandIcon(size: number) {
  const artwork = await readFile(join(process.cwd(), "public", BRAND_MARK_SRC));
  const height = Math.round(size * .86);
  const width = Math.round(height * BRAND_MARK_WIDTH / BRAND_MARK_HEIGHT);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <img src={`data:image/png;base64,${artwork.toString("base64")}`} alt="" width={width} height={height} />
    </div>,
    { width: size, height: size },
  );
}
