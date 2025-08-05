/* eslint-disable no-console */
export async function compileAndRender(fsSource, canvasId) {
  // --- 0. Clean the fragment shader string ---------------------------------
  const fragmentSrc = fsSource
    .replace(/^```(?:glsl)?\n?/i, "")  // Remove opening ```glsl
    .replace(/```$/g, "")              // Remove closing ```
    .replace(/^```\n?/i, "")           // Remove opening ``` without glsl
    .replace(/```\n?$/g, "")           // Remove closing ``` 
    .trim();

  console.log('Cleaned shader source:', fragmentSrc);

  // --- 1. Grab WebGL context -------------------------------------------------
  const canvas = document.getElementById(canvasId);
  if (!canvas) throw new Error(`Canvas #${canvasId} not found`);

  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("WebGL not supported");

  // --- 2. Provide a minimal vertex shader -----------------------------------
  const vertexSrc = `
    attribute vec2 position;
    varying vec2 v_uv;
    void main() {
      v_uv = position * 0.5 + 0.5;   // map -1..1 to 0..1
      gl_Position = vec4(position, 0.0, 1.0);
    }`;

  // --- 3. Compile helpers ----------------------------------------------------
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(shader);
      console.error("Shader compile error:", msg);
      console.error("Source was:\n", source);
      alert("Shader compile error: " + msg + "\n\nSource:\n" + source);
      throw new Error(msg);
    }
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);

  // --- 4. Link program -------------------------------------------------------
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const msg = gl.getProgramInfoLog(prog);
    console.error("Program link error:", msg);
    throw new Error(msg);
  }
  gl.useProgram(prog);

  // --- 5. Full-screen triangle strip ----------------------------------------
  const verts = new Float32Array([
    -1, -1,  // bottom-left
     1, -1,  // bottom-right
    -1,  1,  // top-left
     1,  1   // top-right
  ]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(prog, "position");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  // --- 6. Set up uniforms ----------------------------------------------------
  const timeLoc = gl.getUniformLocation(prog, "u_time");
  const resolutionLoc = gl.getUniformLocation(prog, "u_resolution");
  const start = performance.now();

  // Set resolution uniform
  if (resolutionLoc) {
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
  }

  // --- 7. Render loop --------------------------------------------------------
  function draw() {
    if (timeLoc) {
      gl.uniform1f(timeLoc, (performance.now() - start) / 1000);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
  }

  draw();
} 