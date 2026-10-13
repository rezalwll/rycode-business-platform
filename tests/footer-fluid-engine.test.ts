// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startFluidSimulation } from "@/components/site/footer-fluid-engine";

let frames: Map<number, FrameRequestCallback>;
let frameId: number;
beforeEach(() => {
  frames = new Map();
  frameId = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("devicePixelRatio", 1);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function mockGL() {
  const values: Record<string, number | ReturnType<typeof vi.fn>> = {};
  let enumValue = 100;
  const gl = new Proxy(values, {
    get(target, name: string) {
      if (name in target) return target[name];
      if (
        /^[A-Z\d_]+$/.test(name) ||
        name === "drawingBufferWidth" ||
        name === "drawingBufferHeight"
      )
        return (target[name] = enumValue++);
      return (target[name] = vi.fn((...args: unknown[]) => {
        if (name.startsWith("create")) return { name, id: Math.random() };
        if (name === "getExtension") return { HALF_FLOAT_OES: 1 };
        if (name === "getShaderParameter") return true;
        if (name === "getProgramParameter") return args[1] === gl.LINK_STATUS ? true : 0;
        if (name === "checkFramebufferStatus") return gl.FRAMEBUFFER_COMPLETE;
        if (name === "isContextLost") return false;
        return undefined;
      }));
    },
  }) as unknown as WebGLRenderingContext & Record<string, ReturnType<typeof vi.fn>>;
  return gl;
}
function fixture(gl: WebGLRenderingContext | null) {
  const host = document.createElement("footer");
  const canvas = document.createElement("canvas");
  host.append(canvas);
  vi.spyOn(canvas, "getContext").mockReturnValue(gl);
  Object.defineProperties(canvas, {
    clientWidth: { configurable: true, value: 400 },
    clientHeight: { configurable: true, value: 200 },
  });
  vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
    left: 100,
    top: 200,
    width: 400,
    height: 200,
  } as DOMRect);
  return { host, canvas };
}
function pointer(host: HTMLElement, x: number, y: number) {
  const event = new MouseEvent("pointermove", { clientX: x, clientY: y, bubbles: true });
  Object.defineProperty(event, "pointerType", { value: "mouse" });
  host.dispatchEvent(event);
}
function tick() {
  const next = frames.entries().next().value;
  if (!next) throw new Error("No animation frame scheduled");
  frames.delete(next[0]);
  next[1](16);
}

describe("adapted source fluid renderer", () => {
  it("falls back safely without WebGL", () => {
    const { host, canvas } = fixture(null);
    expect(startFluidSimulation(canvas, host, [])).toBeNull();
    expect(frames.size).toBe(0);
  });
  it("maps pointers relative to footer bounds, paints transparently and releases every GPU resource", () => {
    const gl = mockGL();
    const { host, canvas } = fixture(gl);
    const controller = startFluidSimulation(canvas, host, [{ r: 0.4, g: 192 / 255, b: 1 }])!;
    expect(controller).toBeTruthy();
    expect(frames.size).toBe(0);
    controller.resume();
    expect(frames.size).toBe(1);
    vi.mocked(gl.uniform2f).mockClear();
    pointer(host, 200, 250);
    pointer(host, 300, 300);
    tick();
    expect(gl.uniform2f).toHaveBeenCalledWith(undefined, 0.5, 0.5);
    expect(gl.clearColor).toHaveBeenCalledWith(0, 0, 0, 0);
    controller.pause();
    expect(frames.size).toBe(0);
    controller.resume();
    controller.dispose();
    controller.dispose();
    expect(frames.size).toBe(0);
    for (const [create, remove] of [
      ["createTexture", "deleteTexture"],
      ["createFramebuffer", "deleteFramebuffer"],
      ["createBuffer", "deleteBuffer"],
      ["createShader", "deleteShader"],
      ["createProgram", "deleteProgram"],
    ]) {
      expect(gl[remove!]!.mock.calls.length).toBe(gl[create!]!.mock.calls.length);
    }
    controller.resume();
    expect(frames.size).toBe(0);
  });
  it("does not listen to whole-page pointers and stops on context loss", () => {
    const gl = mockGL();
    const { host, canvas } = fixture(gl);
    const controller = startFluidSimulation(canvas, host, [])!;
    controller.resume();
    const resourceCalls = vi.mocked(gl.deleteTexture).mock.calls.length;
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 300, clientY: 300 }));
    canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    expect(frames.size).toBe(0);
    expect(vi.mocked(gl.deleteTexture).mock.calls.length).toBeGreaterThan(resourceCalls);
    controller.dispose();
  });
  it("falls back cleanly when a GPU frame throws instead of leaving an animation loop", () => {
    const gl = mockGL();
    const { host, canvas } = fixture(gl);
    const controller = startFluidSimulation(canvas, host, [])!;
    vi.mocked(gl.drawElements).mockImplementationOnce(() => {
      throw new Error("GPU unavailable");
    });
    expect(() => controller.resume()).not.toThrow();
    expect(frames.size).toBe(0);
    expect(vi.mocked(gl.deleteTexture).mock.calls.length).toBe(
      vi.mocked(gl.createTexture).mock.calls.length,
    );
  });
});
