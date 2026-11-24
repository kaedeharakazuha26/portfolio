import { useEffect, useRef } from 'react';

// Real-time WebGL Navier-Stokes fluid solver inspired by PavelDoGreat/WebGL-Fluid-Simulation.

interface WebGLFluidCanvasProps {
  theme: 'dark' | 'light';
  enabled: boolean;
  reducedMotion: boolean;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface ShaderProg {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

interface PendingSplat {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: [number, number, number];
  radius: number;
}

const BASE_VERTEX = `
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
`;

const CLEAR_FRAG = `
  precision mediump float;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const SPLAT_FRAG = `
  precision highp float;
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
`;

const ADVECTION_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const DIVERGENCE_FRAG = `
  precision mediump float;
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
`;

const CURL_FRAG = `
  precision mediump float;
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
`;

const VORTICITY_FRAG = `
  precision highp float;
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
    velocity = clamp(velocity, vec2(-1000.0), vec2(1000.0));
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const PRESSURE_FRAG = `
  precision mediump float;
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
`;

const GRADIENT_SUB_FRAG = `
  precision mediump float;
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
`;

const DISPLAY_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uIntensity;
  void main () {
    vec3 raw = max(texture2D(uTexture, vUv).rgb, vec3(0.0));
    vec3 c = raw * uIntensity;
    // Soft tone curve with restrained atmospheric opacity
    c = c / (vec3(1.0) + c * 0.65);
    float a = clamp(max(c.r, max(c.g, c.b)) * 0.72, 0.0, 0.36);
    gl_FragColor = vec4(c, a);
  }
`;

const FLUID_PALETTE_DARK: Array<[number, number, number]> = [
  [0.62, 0.36, 0.04], // warm obsidian amber
  [0.04, 0.48, 0.62], // electric cyan
  [0.14, 0.30, 0.72], // deep cobalt
  [0.56, 0.20, 0.06], // copper ember
];

const FLUID_PALETTE_LIGHT: Array<[number, number, number]> = [
  [0.42, 0.24, 0.04],
  [0.04, 0.34, 0.46],
  [0.10, 0.22, 0.52],
];

export function WebGLFluidCanvas({
  theme,
  enabled,
  reducedMotion,
}: WebGLFluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const darkRef = useRef(theme === 'dark');
  darkRef.current = theme === 'dark';

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: true,
    };

    const gl2 = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null;
    const gl = (gl2 ?? canvas.getContext('webgl', params)) as
      | WebGL2RenderingContext
      | WebGLRenderingContext
      | null;
    if (!gl) return;

    const isWebGL2 = Boolean(gl2);
    let halfFloatTexType: number;
    let internalFormat: number;
    let format: number;
    let linearFiltering = false;

    if (isWebGL2 && gl2) {
      const floatExt =
        gl2.getExtension('EXT_color_buffer_float') ??
        gl2.getExtension('EXT_color_buffer_half_float');
      if (!floatExt) return;
      // WebGL2 guarantees linear filtering for RGBA16F; OES_texture_float_linear is a bonus.
      linearFiltering = true;
      gl2.getExtension('OES_texture_float_linear');
      halfFloatTexType = gl2.HALF_FLOAT;
      internalFormat = gl2.RGBA16F;
      format = gl2.RGBA;
    } else {
      const halfFloat = gl.getExtension('OES_texture_half_float');
      if (!halfFloat) return;
      linearFiltering = Boolean(gl.getExtension('OES_texture_half_float_linear'));
      halfFloatTexType = halfFloat.HALF_FLOAT_OES;
      internalFormat = gl.RGBA;
      format = gl.RGBA;
    }

    const filtering = linearFiltering ? gl.LINEAR : gl.NEAREST;

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (fragSrc: string): ShaderProg | null => {
      const vs = compile(gl.VERTEX_SHADER, BASE_VERTEX);
      const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
      if (!vs || !fs) return null;
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    };

    const clearProg = createProgram(CLEAR_FRAG);
    const splatProg = createProgram(SPLAT_FRAG);
    const advectProg = createProgram(ADVECTION_FRAG);
    const divProg = createProgram(DIVERGENCE_FRAG);
    const curlProg = createProgram(CURL_FRAG);
    const vortProg = createProgram(VORTICITY_FRAG);
    const pressureProg = createProgram(PRESSURE_FRAG);
    const gradSubProg = createProgram(GRADIENT_SUB_FRAG);
    const displayProg = createProgram(DISPLAY_FRAG);

    if (
      !clearProg ||
      !splatProg ||
      !advectProg ||
      !divProg ||
      !curlProg ||
      !vortProg ||
      !pressureProg ||
      !gradSubProg ||
      !displayProg
    ) {
      return;
    }

    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const createdTextures: WebGLTexture[] = [];
    const createdFbos: WebGLFramebuffer[] = [];

    const createFBO = (w: number, h: number, filter: number): FBO | null => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      if (!texture) return null;
      createdTextures.push(texture);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, halfFloatTexType, null);

      const fbo = gl.createFramebuffer();
      if (!fbo) return null;
      createdFbos.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        return null;
      }
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (w: number, h: number, filter: number): DoubleFBO | null => {
      let fbo1 = createFBO(w, h, filter);
      let fbo2 = createFBO(w, h, filter);
      if (!fbo1 || !fbo2) return null;
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1!;
        },
        get write() {
          return fbo2!;
        },
        swap() {
          const tmp = fbo1;
          fbo1 = fbo2;
          fbo2 = tmp;
        },
      };
    };

    const blit = (target: FBO | null) => {
      if (!target) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const simRes = 128;
    const dyeRes = 256;
    const aspect = Math.max(0.5, window.innerWidth / Math.max(1, window.innerHeight));
    const simW = aspect >= 1 ? Math.round(simRes * aspect) : simRes;
    const simH = aspect >= 1 ? simRes : Math.round(simRes / aspect);
    const dyeW = aspect >= 1 ? Math.round(dyeRes * aspect) : dyeRes;
    const dyeH = aspect >= 1 ? dyeRes : Math.round(dyeRes / aspect);

    const velocity = createDoubleFBO(simW, simH, filtering);
    const dye = createDoubleFBO(dyeW, dyeH, filtering);
    const divergence = createFBO(simW, simH, gl.NEAREST);
    const curlFbo = createFBO(simW, simH, gl.NEAREST);
    const pressure = createDoubleFBO(simW, simH, gl.NEAREST);

    if (!velocity || !dye || !divergence || !curlFbo || !pressure) {
      createdTextures.forEach((t) => gl.deleteTexture(t));
      createdFbos.forEach((f) => gl.deleteFramebuffer(f));
      return;
    }

    let colorIdx = 0;
    const nextColor = (): [number, number, number] => {
      const list = darkRef.current ? FLUID_PALETTE_DARK : FLUID_PALETTE_LIGHT;
      const c = list[colorIdx % list.length]!;
      colorIdx += 1;
      return c;
    };

    // Queue all splats into the RAF step while BLEND is guaranteed disabled (avoids RGBA16F GL_INVALID_OPERATION).
    const pendingSplats: PendingSplat[] = [
      { x: 0.25, y: 0.54, dx: 900, dy: 420, color: nextColor(), radius: 0.0045 },
      { x: 0.72, y: 0.46, dx: -860, dy: -360, color: nextColor(), radius: 0.0045 },
    ];

    const runSplat = (s: PendingSplat) => {
      const curAspect = canvas.width / Math.max(1, canvas.height);
      gl.useProgram(splatProg.program);
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, curAspect);
      gl.uniform2f(splatProg.uniforms.point, s.x, s.y);
      gl.uniform3f(splatProg.uniforms.color, s.dx, s.dy, 0.0);
      gl.uniform1f(splatProg.uniforms.radius, s.radius);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, s.color[0], s.color[1], s.color[2]);
      blit(dye.write);
      dye.swap();
    };

    let lastX = -1;
    let lastY = -1;
    let activeColor = nextColor();
    let moveCounter = 0;

    const onPointerMove = (e: PointerEvent) => {
      const nx = e.clientX / Math.max(1, window.innerWidth);
      const ny = 1 - e.clientY / Math.max(1, window.innerHeight);
      if (lastX < 0) {
        lastX = nx;
        lastY = ny;
        return;
      }
      const dx = (nx - lastX) * 5200;
      const dy = (ny - lastY) * 5200;
      lastX = nx;
      lastY = ny;
      if (Math.hypot(dx, dy) < 4) return;

      moveCounter += 1;
      if (moveCounter % 16 === 0) activeColor = nextColor();
      if (pendingSplats.length < 16) {
        pendingSplats.push({
          x: nx,
          y: ny,
          dx: Math.max(-1800, Math.min(1800, dx)),
          dy: Math.max(-1800, Math.min(1800, dy)),
          color: activeColor,
          radius: 0.0028,
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const nx = e.clientX / Math.max(1, window.innerWidth);
      const ny = 1 - e.clientY / Math.max(1, window.innerHeight);
      const c = nextColor();
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        pendingSplats.push({
          x: nx,
          y: ny,
          dx: Math.cos(angle) * 1150,
          dy: Math.sin(angle) * 1150,
          color: c,
          radius: 0.0042,
        });
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      rafId = requestAnimationFrame(step);
      if (document.hidden) {
        lastTime = now;
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.0166);
      lastTime = now;

      // Always keep BLEND off for all floating-point FBO passes
      gl.disable(gl.BLEND);

      while (pendingSplats.length > 0) {
        const next = pendingSplats.shift();
        if (next) runSplat(next);
      }

      // Curl
      gl.useProgram(curlProg.program);
      gl.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFbo);

      // Vorticity confinement
      gl.useProgram(vortProg.program);
      gl.uniform2f(vortProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vortProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vortProg.uniforms.uCurl, curlFbo.attach(1));
      gl.uniform1f(vortProg.uniforms.curl, 28);
      gl.uniform1f(vortProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      // Divergence
      gl.useProgram(divProg.program);
      gl.uniform2f(divProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      // Clear pressure
      gl.useProgram(clearProg.program);
      gl.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProg.uniforms.value, 0.8);
      blit(pressure.write);
      pressure.swap();

      // Jacobi pressure solver (12 iterations keeps GPU ultra-light)
      gl.useProgram(pressureProg.program);
      gl.uniform2f(pressureProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < 12; i++) {
        gl.uniform1i(pressureProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      gl.useProgram(gradSubProg.program);
      gl.uniform2f(gradSubProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradSubProg.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradSubProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      // Advect velocity
      gl.useProgram(advectProg.program);
      gl.uniform2f(advectProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectProg.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectProg.uniforms.dt, dt);
      gl.uniform1f(advectProg.uniforms.dissipation, 0.28);
      blit(velocity.write);
      velocity.swap();

      // Advect dye (fades smoothly back to transparent when pointer rests)
      gl.uniform1i(advectProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectProg.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectProg.uniforms.dissipation, 0.92);
      blit(dye.write);
      dye.swap();

      // Display to transparent canvas (must bind default framebuffer BEFORE clearing!)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(displayProg.program);
      gl.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      gl.uniform1f(displayProg.uniforms.uIntensity, darkRef.current ? 0.44 : 0.28);
      blit(null);
      gl.disable(gl.BLEND);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);

      createdTextures.forEach((t) => gl.deleteTexture(t));
      createdFbos.forEach((f) => gl.deleteFramebuffer(f));
      if (quadBuf) gl.deleteBuffer(quadBuf);
      if (idxBuf) gl.deleteBuffer(idxBuf);
      [
        clearProg,
        splatProg,
        advectProg,
        divProg,
        curlProg,
        vortProg,
        pressureProg,
        gradSubProg,
        displayProg,
      ].forEach((p) => gl.deleteProgram(p.program));
    };
  }, [enabled, reducedMotion]);

  if (!enabled || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-70"
    />
  );
}
