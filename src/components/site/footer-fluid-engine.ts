// Fluid shaders/solver adapted from the user-provided glass-portfolio/src/app/fluid.ts.
// Footer-local input, RYCODE colors, transparent rendering and managed GPU lifecycle.
// @ts-nocheck
/* eslint-disable */

export type FluidColor = { r: number; g: number; b: number };
export type FooterFluidController = { pause: () => void; resume: () => void; dispose: () => void };

export function startFluidSimulation(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  palette: readonly FluidColor[],
): FooterFluidController | null {
  const textures = new Set<WebGLTexture>();
  const framebuffers = new Set<WebGLFramebuffer>();
  const buffers = new Set<WebGLBuffer>();
  const shaders = new Set<WebGLShader>();
  const programs = new Set<WebGLProgram>();
  let cleanupGL: WebGLRenderingContext | null = null;
  let frame = 0;
  let active = false;
  let disposed = false;
  let unbindPointerEvents = () => {};

  function trackResource<T>(collection: Set<T>, resource: T | null): T {
    if (!resource) throw new Error("Footer fluid resource allocation failed");
    collection.add(resource);
    return resource;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    active = false;
    cancelAnimationFrame(frame);
    unbindPointerEvents();
    if (!cleanupGL) return;
    for (const resource of textures) cleanupGL.deleteTexture(resource);
    for (const resource of framebuffers) cleanupGL.deleteFramebuffer(resource);
    for (const resource of buffers) cleanupGL.deleteBuffer(resource);
    for (const resource of shaders) cleanupGL.deleteShader(resource);
    for (const resource of programs) cleanupGL.deleteProgram(resource);
    textures.clear();
    framebuffers.clear();
    buffers.clear();
    shaders.clear();
    programs.clear();
  }

  try {
    const config = {
      SIM_RESOLUTION: 96,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 1.2,
      VELOCITY_DISSIPATION: 3,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 12,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 1.5,
    };

    const pointers: Pointer[] = [];
    pointers.push(new Pointer());

    const { gl, ext } = getWebGLContext(canvas);
    cleanupGL = gl;
    if (!gl || !ext || !ext.halfFloatTexType || !ext.formatRGBA || !ext.formatRG || !ext.formatR) {
      dispose();
      return null;
    }

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    // Shaders
    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `,
    );

    const blurVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `,
    );

    const displayShaderSource = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform vec2 texelSize;
    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
    #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
    #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
  `;

    const copyProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
  `,
      ),
    );

    const clearProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `,
      ),
    );

    const splatProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
  `,
      ),
    );

    const advectionProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;
    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }
    void main () {
    #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
    #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
    #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }
  `,
      ),
      ext.supportLinearFiltering ? [] : ["MANUAL_FILTERING"],
    );

    const divergenceProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `,
      ),
    );

    const curlProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
  `,
      ),
    );

    const vorticityProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `,
      ),
    );

    const pressureProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `,
      ),
    );

    const gradientSubtractProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `,
      ),
    );

    const displayProgram = new KeywordProgram(baseVertexShader, displayShaderSource);

    // Geometry
    initQuad(gl);

    let velocity: DoubleFBO, density: DoubleFBO, divergence: FBO, curl: FBO, pressure: DoubleFBO;
    let lastTime = Date.now();
    let colorAcc = 0;

    resizeCanvas();
    initFramebuffers();
    updateKeywords();

    function updateKeywords() {
      const keywords: string[] = [];
      if (config.SHADING) keywords.push("SHADING");
      displayProgram.setKeywords(keywords);
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);
      density = density
        ? resizeDoubleFBO(density, dyeRes.width, dyeRes.height, rgba, texType, filtering)
        : createDoubleFBO(
            dyeRes.width,
            dyeRes.height,
            rgba.internalFormat,
            rgba.format,
            texType,
            filtering,
          );
      velocity = velocity
        ? resizeDoubleFBO(velocity, simRes.width, simRes.height, rg, texType, filtering)
        : createDoubleFBO(
            simRes.width,
            simRes.height,
            rg.internalFormat,
            rg.format,
            texType,
            filtering,
          );
      if (divergence) releaseFBO(divergence);
      if (curl) releaseFBO(curl);
      if (pressure) {
        releaseFBO(pressure.read);
        releaseFBO(pressure.write);
      }
      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST,
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST,
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST,
      );
    }

    function step(dt: number) {
      gl.disable(gl.BLEND);

      // Curl
      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      // Vorticity
      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      // Divergence
      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      // Clear pressure
      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      // Pressure solve
      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      gradientSubtractProgram.bind();
      gl.uniform2f(
        gradientSubtractProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      // Advect velocity
      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texelSizeX,
          velocity.texelSizeY,
        );
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      // Advect dye
      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          density.texelSizeX,
          density.texelSizeY,
        );
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(density.write);
      density.swap();

      // Render onto a transparent canvas over the white footer, never an opaque black buffer.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      const target = null;
      const viewportWidth = gl.drawingBufferWidth;
      const viewportHeight = gl.drawingBufferHeight;
      displayProgram.bind();
      if (config.SHADING)
        gl.uniform2f(displayProgram.uniforms.texelSize, 1 / viewportWidth, 1 / viewportHeight);
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read.attach(0));
      blit(target);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: RGB) {
      const aspectRatio = canvas.width / canvas.height;
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, aspectRatio);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(
        splatProgram.uniforms.radius,
        scaleByResolution(config.SPLAT_RADIUS / 100, aspectRatio),
      );
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(density.write);
      density.swap();
    }

    function scaleByResolution(radius: number, aspect: number) {
      if (aspect > 1) radius *= aspect;
      return radius;
    }

    function calcDeltaT() {
      const now = Date.now();
      let dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;
      return dt;
    }

    function render() {
      try {
        renderFrame();
      } catch {
        dispose();
      }
    }

    function renderFrame() {
      if (!active || disposed || gl.isContextLost()) {
        active = false;
        return;
      }
      if (resizeCanvas()) {
        initFramebuffers();
      }

      const dt = calcDeltaT();
      colorAcc += dt * config.COLOR_UPDATE_SPEED;
      if (colorAcc >= 1) {
        colorAcc = wrap(colorAcc, 0, 1);
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }

      pointers.forEach((p) => {
        if (!p.moved) return;
        p.moved = false;
        const dx = p.deltaX * config.SPLAT_FORCE;
        const dy = p.deltaY * config.SPLAT_FORCE;
        splat(p.texcoordX, p.texcoordY, dx, dy, p.color);
      });

      step(dt);
      frame = requestAnimationFrame(render);
    }

    function resizeCanvas() {
      const width = resizeValue(canvas.clientWidth);
      const height = resizeValue(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        return true;
      }
      return false;
    }

    function resizeValue(value: number) {
      return Math.max(1, Math.floor(value * Math.min(window.devicePixelRatio || 1, 1.5)));
    }

    function getResolution(baseResolution: number) {
      let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const width = Math.round(baseResolution * aspect);
      const height = Math.round(baseResolution);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width, height }
        : { width: height, height: width };
    }

    function wrap(value: number, min: number, max: number) {
      const range = max - min;
      return ((((value - min) % range) + range) % range) + min;
    }

    function bindPointerEvents() {
      const primary = pointers[0];
      const position = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return null;
        return { x: x * canvas.width, y: y * canvas.height };
      };
      const onMove = (event: PointerEvent) => {
        if (!active || event.pointerType === "touch") return;
        const point = position(event);
        if (point) updatePointerMove(primary, point.x, point.y);
      };
      const onDown = (event: PointerEvent) => {
        if (!active || event.pointerType === "touch") return;
        const point = position(event);
        if (!point) return;
        updatePointerDown(primary, event.pointerId, point.x, point.y);
        splatImmediate(primary);
      };
      const reset = () => {
        primary.down = false;
        primary.moved = false;
      };
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerdown", onDown, { passive: true });
      host.addEventListener("pointerleave", reset);
      // A lost GPU context falls back to the plain footer instead of using stale handles.
      const onLost = (event: Event) => {
        event.preventDefault();
        dispose();
      };
      canvas.addEventListener("webglcontextlost", onLost);
      unbindPointerEvents = () => {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerdown", onDown);
        host.removeEventListener("pointerleave", reset);
        canvas.removeEventListener("webglcontextlost", onLost);
      };
    }

    function pause() {
      active = false;
      cancelAnimationFrame(frame);
      pointers.forEach((pointer) => {
        pointer.down = false;
        pointer.moved = false;
      });
    }

    function resume() {
      if (disposed || active || gl.isContextLost()) return;
      active = true;
      lastTime = Date.now();
      render();
    }

    function updatePointerDown(pointer: Pointer, id: number, x: number, y: number) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = x / canvas.width;
      pointer.texcoordY = 1 - y / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function updatePointerMove(pointer: Pointer, x: number, y: number) {
      // اگر کاربر کلیک نکرده باشد، حرکت موس را برای فعال‌کردن افکت کافی می‌دانیم.
      if (!pointer.down) {
        pointer.down = true;
        pointer.prevTexcoordX = x / canvas.width;
        pointer.prevTexcoordY = 1 - y / canvas.height;
        pointer.texcoordX = pointer.prevTexcoordX;
        pointer.texcoordY = pointer.prevTexcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        return;
      }
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = x / canvas.width;
      pointer.texcoordY = 1 - y / canvas.height;
      let deltaX = pointer.texcoordX - pointer.prevTexcoordX;
      let deltaY = pointer.texcoordY - pointer.prevTexcoordY;
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) deltaX *= aspectRatio;
      if (aspectRatio > 1) deltaY /= aspectRatio;
      pointer.deltaX = deltaX;
      pointer.deltaY = deltaY;
      pointer.moved = Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0;
    }

    function splatImmediate(pointer: Pointer) {
      const color = randomColor();
      color.r *= 10;
      color.g *= 10;
      color.b *= 10;
      const dx = 10 * (Math.random() - 0.5);
      const dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function randomColor(): RGB {
      const colors = palette.length ? palette : [{ r: 102 / 255, g: 192 / 255, b: 1 }];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return { r: color.r * 0.15, g: color.g * 0.15, b: color.b * 0.15 };
    }

    function generateColor() {
      return randomColor();
    }

    function Pointer(this: Pointer) {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = randomColor();
    }

    function initQuad(glContext: WebGLRenderingContext) {
      const triangleVertices = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
      const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
      glContext.bindBuffer(
        glContext.ARRAY_BUFFER,
        trackResource(buffers, glContext.createBuffer()),
      );
      glContext.bufferData(glContext.ARRAY_BUFFER, triangleVertices, glContext.STATIC_DRAW);
      glContext.bindBuffer(
        glContext.ELEMENT_ARRAY_BUFFER,
        trackResource(buffers, glContext.createBuffer()),
      );
      glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, indices, glContext.STATIC_DRAW);
      glContext.vertexAttribPointer(0, 2, glContext.FLOAT, false, 0, 0);
      glContext.enableVertexAttribArray(0);
    }

    function blit(target: FBO | DoubleFBO | null, clear = false) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, (target as FBO).fbo ?? (target as DoubleFBO).read.fbo);
      }
      if (clear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function releaseFBO(target: FBO) {
      gl.deleteTexture(target.texture);
      gl.deleteFramebuffer(target.fbo);
      textures.delete(target.texture);
      framebuffers.delete(target.fbo);
    }

    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number,
    ): FBO {
      gl.activeTexture(gl.TEXTURE0);
      const texture = trackResource(textures, gl.createTexture());
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = trackResource(framebuffers, gl.createFramebuffer());
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const texelSizeX = 1 / w;
      const texelSizeY = 1 / h;
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number,
    ): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number,
    ) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      releaseFBO(target);
      return newFBO;
    }

    function resizeDoubleFBO(
      doubleFBO: DoubleFBO,
      w: number,
      h: number,
      format: { internalFormat: number; format: number },
      type: number,
      param: number,
    ): DoubleFBO {
      if (doubleFBO.width === w && doubleFBO.height === h) return doubleFBO;
      const newRead = resizeFBO(
        doubleFBO.read,
        w,
        h,
        format.internalFormat,
        format.format,
        type,
        param,
      );
      const newWrite = createFBO(w, h, format.internalFormat, format.format, type, param);
      releaseFBO(doubleFBO.write);
      return {
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        read: newRead,
        write: newWrite,
        swap() {
          const temp = this.read;
          this.read = this.write;
          this.write = temp;
        },
      };
    }

    function getWebGLContext(targetCanvas: HTMLCanvasElement) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };
      let glContext = targetCanvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
      const isWebGL2 = !!glContext;
      let halfFloatExt: any;
      let halfFloatType: number | null = null;
      let supportLinearFiltering;
      if (!glContext) {
        glContext = (targetCanvas.getContext("webgl", params) ||
          targetCanvas.getContext(
            "experimental-webgl",
            params,
          )) as unknown as WebGL2RenderingContext | null;
      }
      if (!glContext) return { gl: null, ext: null };
      cleanupGL = glContext;

      if (isWebGL2) {
        glContext.getExtension("EXT_color_buffer_float");
        halfFloatType = (glContext as any).HALF_FLOAT;
        supportLinearFiltering = glContext.getExtension("OES_texture_float_linear");
      } else {
        halfFloatExt = glContext.getExtension("OES_texture_half_float");
        halfFloatType = halfFloatExt ? halfFloatExt.HALF_FLOAT_OES : null;
        supportLinearFiltering = glContext.getExtension("OES_texture_half_float_linear");
      }
      glContext.clearColor(0, 0, 0, 0);

      const formatRGBA = getSupportedFormat(
        glContext,
        (glContext as any).RGBA16F || glContext.RGBA,
        glContext.RGBA,
        halfFloatType!,
      );
      const formatRG = getSupportedFormat(
        glContext,
        (glContext as any).RG16F || glContext.RGBA,
        (glContext as any).RG || glContext.RGBA,
        halfFloatType!,
      );
      const formatR = getSupportedFormat(
        glContext,
        (glContext as any).R16F || glContext.RGBA,
        (glContext as any).RED || glContext.RGBA,
        halfFloatType!,
      );

      return {
        gl: glContext as WebGLRenderingContext,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType: halfFloatType!,
          supportLinearFiltering: !!supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(
      glContext: any,
      internalFormat: number,
      format: number,
      type: number,
    ) {
      if (checkFramebuffer(glContext, internalFormat, format, type)) {
        return { internalFormat, format };
      }
      switch (internalFormat) {
        case glContext.R16F:
          return getSupportedFormat(glContext, glContext.RG16F, glContext.RG, type);
        case glContext.RG16F:
          return getSupportedFormat(glContext, glContext.RGBA16F, glContext.RGBA, type);
        default:
          return null;
      }
    }

    function checkFramebuffer(
      glContext: any,
      internalFormat: number,
      format: number,
      type: number,
    ) {
      const texture = trackResource(textures, glContext.createTexture());
      glContext.bindTexture(glContext.TEXTURE_2D, texture);
      glContext.texParameteri(
        glContext.TEXTURE_2D,
        glContext.TEXTURE_MIN_FILTER,
        glContext.NEAREST,
      );
      glContext.texParameteri(
        glContext.TEXTURE_2D,
        glContext.TEXTURE_MAG_FILTER,
        glContext.NEAREST,
      );
      glContext.texParameteri(
        glContext.TEXTURE_2D,
        glContext.TEXTURE_WRAP_S,
        glContext.CLAMP_TO_EDGE,
      );
      glContext.texParameteri(
        glContext.TEXTURE_2D,
        glContext.TEXTURE_WRAP_T,
        glContext.CLAMP_TO_EDGE,
      );
      glContext.texImage2D(glContext.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      const fbo = trackResource(framebuffers, glContext.createFramebuffer());
      glContext.bindFramebuffer(glContext.FRAMEBUFFER, fbo);
      glContext.framebufferTexture2D(
        glContext.FRAMEBUFFER,
        glContext.COLOR_ATTACHMENT0,
        glContext.TEXTURE_2D,
        texture,
        0,
      );
      const status = glContext.checkFramebufferStatus(glContext.FRAMEBUFFER);
      glContext.deleteTexture(texture);
      glContext.deleteFramebuffer(fbo);
      textures.delete(texture);
      framebuffers.delete(fbo);
      return status === glContext.FRAMEBUFFER_COMPLETE;
    }

    function compileShader(type: number, source: string) {
      const shader = trackResource(shaders, gl.createShader(type));
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Footer fluid shader compilation failed");
      }
      return shader;
    }

    function Program(
      this: any,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader,
      _keywords?: string[],
    ) {
      this.uniforms = {} as Record<string, WebGLUniformLocation | null>;
      this.program = createProgram(vertexShader, fragmentShader, _keywords);
      this.uniforms = getUniforms(this.program);
      this.bind = () => {
        gl.useProgram(this.program);
      };
    }

    function KeywordProgram(this: any, vertexShader: WebGLShader, fragmentShaderSource: string) {
      this.vertexShader = vertexShader;
      this.fragmentShaderSource = fragmentShaderSource;
      this.programs = {} as Record<number, WebGLProgram>;
      this.activeProgram = null as WebGLProgram | null;
      this.uniforms = {} as Record<string, WebGLUniformLocation | null>;
      this.setKeywords = (keywords: string[]) => {
        let hash = 0;
        keywords.forEach((k) => {
          hash += hashString(k);
        });
        let program = this.programs[hash];
        if (!program) {
          const fragment = compileShader(
            gl.FRAGMENT_SHADER,
            addKeywords(this.fragmentShaderSource, keywords),
          );
          program = createProgram(this.vertexShader, fragment);
          this.programs[hash] = program;
        }
        if (program !== this.activeProgram) {
          this.uniforms = getUniforms(program);
          this.activeProgram = program;
        }
      };
      this.bind = () => {
        gl.useProgram(this.activeProgram);
      };
    }

    function hashString(str: string) {
      if (str.length === 0) return 0;
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    function addKeywords(source: string, keywords?: string[]) {
      if (!keywords || keywords.length === 0) return source;
      let out = "";
      keywords.forEach((k) => {
        out += `#define ${k}\n`;
      });
      return out + source;
    }

    function createProgram(
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader,
      _keywords?: string[],
    ) {
      const program = trackResource(programs, gl.createProgram());
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Footer fluid shader linking failed");
      }
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniform = gl.getActiveUniform(program, i)!.name;
        uniforms[uniform] = gl.getUniformLocation(program, uniform);
      }
      return uniforms;
    }

    bindPointerEvents();
    return { pause, resume, dispose };

    type RGB = { r: number; g: number; b: number };
    type FBO = {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    };
    type DoubleFBO = {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    };
    type Pointer = {
      id: number;
      texcoordX: number;
      texcoordY: number;
      prevTexcoordX: number;
      prevTexcoordY: number;
      deltaX: number;
      deltaY: number;
      down: boolean;
      moved: boolean;
      color: RGB;
    };
  } catch {
    dispose();
    return null;
  }
}
