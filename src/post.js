// post.js — the WebGL2 pass every frame goes through: chromatic aberration, block glitch, CRT curve,
// bloom, scanlines, grain, vignette, invert, hue spin, flash. Knobs live in FX (core.js), set per shot.
const POST = (() => {
  let gl, prog, tex, U = {};
  const VS = `#version 300 es
  in vec2 p; out vec2 uv; void main(){ uv = p * .5 + .5; uv.y = 1. - uv.y; gl_Position = vec4(p, 0, 1); }`;
  const FS = `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D src;
  uniform float t, zoom, shake, ca, glitch, bloom, scan, crt, grain, invert, hue, vig, flash; uniform vec3 flashCol; uniform vec2 res;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 hueRot(vec3 c, float a){ const vec3 k = vec3(.57735); float co = cos(a); return c * co + cross(k, c) * sin(a) + k * dot(k, c) * (1. - co); }
  vec3 tap(vec2 q){ return texture(src, q).rgb; }
  void main(){
    vec2 q = (uv - .5) / zoom + .5, c = q - .5;
    q += c * dot(c, c) * crt;                                   // barrel
    float fr = floor(t * 24.);
    q += (vec2(h(vec2(fr, 1.7)), h(vec2(fr, 9.3))) - .5) * 2. * shake / res;
    if (glitch > 0.) {                                          // block displacement, steps at 24 fps
      vec2 cell = floor(q * vec2(12., 30.) + vec2(0., h(vec2(fr, 3.)) * 30.));
      float r = h(cell + fr);
      if (r < glitch * .35) q.x += (h(cell * 1.3 + fr) - .5) * .25 * glitch;
      float band = step(1. - glitch * .15, h(vec2(floor(q.y * 90.), fr)));
      q.x += band * (h(vec2(fr, floor(q.y * 90.))) - .5) * .08;
    }
    vec2 d = c * ca * .004 + vec2(ca * .0007, 0.);
    vec3 col = vec3(tap(q + d).r, tap(q).g, tap(q - d).b);
    if (bloom > 0.) {                                           // cheap 12-tap glow of the bright parts
      vec3 b = vec3(0.); float s = 0.;
      for (int i = 0; i < 12; i++) { float a = float(i) * 2.39996, r = .004 + .0035 * float(i);
        vec3 v = tap(q + vec2(cos(a), sin(a)) * r * vec2(res.y / res.x, 1.)); b += max(v - .55, 0.); s += 1.; }
      col += b / s * bloom * 3.;
    }
    col = hueRot(col, hue);
    col = mix(col, 1. - col, invert);
    col *= 1. - scan * (.5 + .5 * sin(uv.y * res.y * 3.14159 / 1.5));
    col += (h(uv * res + fr) - .5) * grain;
    col *= 1. - vig * pow(length(c) * 1.25, 2.4);
    col = mix(col, flashCol, clamp(flash, 0., 1.));
    if (q.x < 0. || q.x > 1. || q.y < 0. || q.y > 1.) col = vec3(0.);
    o = vec4(col, 1.);
  }`;
  function init(canvas) {
    gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
    const sh = (type, s) => { const x = gl.createShader(type); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
    prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    for (const n of ['src', 't', 'zoom', 'shake', 'ca', 'glitch', 'bloom', 'scan', 'crt', 'grain', 'invert', 'hue', 'vig', 'flash', 'flashCol', 'res']) U[n] = gl.getUniformLocation(prog, n);
  }
  function run(srcCanvas, t) {
    gl.viewport(0, 0, W, H); gl.useProgram(prog); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
    gl.uniform1i(U.src, 0); gl.uniform1f(U.t, t); gl.uniform2f(U.res, W, H);
    for (const k of ['zoom', 'shake', 'ca', 'glitch', 'bloom', 'scan', 'crt', 'grain', 'invert', 'hue', 'vig', 'flash']) gl.uniform1f(U[k], FX[k]);
    gl.uniform3f(U.flashCol, ...FX.flashCol);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); gl.finish();
  }
  return { init, run };
})();
