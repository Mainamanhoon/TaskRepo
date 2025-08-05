/**
 * WebGL Shader Compilation and Rendering Utility
 * 
 * This module provides functions to compile and render GLSL fragment shaders
 * using raw WebGL API. It handles shader compilation, program linking,
 * uniform setup, and rendering loop.
 */

/* eslint-disable no-console */

/**
 * Compiles and renders a GLSL fragment shader on a canvas
 * @param {string} fsSource - The fragment shader source code
 * @param {string} canvasId - The ID of the canvas element
 */
export async function compileAndRender(fsSource, canvasId) {
  // --- 0. Clean the fragment shader string ---------------------------------
  const fragmentSrc = fsSource
    .replace(/^```(?:glsl)?\n?/i, "")
    .replace(/```$/, "")
    .trim();

  console.log("Cleaned shader source:", fragmentSrc);
  console.log("Shader length:", fragmentSrc.length);

  // --- 1. Create canvas element -------------------------------------------------
  // Remove any existing canvas with the same ID
  const existingCanvas = document.getElementById(canvasId);
  if (existingCanvas) {
    existingCanvas.remove();
  }

  // Create a new canvas element
  const canvas = document.createElement('canvas');
  canvas.id = canvasId;
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    border: none;
    pointer-events: none;
    background: transparent;
    display: block;
  `;
  
  // Append to document body
  document.body.appendChild(canvas);
  
  console.log("Canvas element created:", canvas);

  // Wait a bit for the canvas to be properly initialized
  await new Promise(resolve => setTimeout(resolve, 100));

  // Set canvas size to match window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log("Canvas size set to:", canvas.width, "x", canvas.height);

  // Try multiple WebGL context options
  let gl = null;
  const contextOptions = [
    { antialias: true, alpha: false, depth: false, stencil: false },
    { antialias: false, alpha: false, depth: false, stencil: false },
    { antialias: false, alpha: true, depth: false, stencil: false },
    { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "default" },
    { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance" }
  ];

  console.log("Attempting to create WebGL context...");
  for (let i = 0; i < contextOptions.length; i++) {
    const options = contextOptions[i];
    try {
      console.log(`Trying context option ${i + 1}:`, options);
      gl = canvas.getContext("webgl", options);
      if (!gl) {
        gl = canvas.getContext("experimental-webgl", options);
      }
      if (gl) {
        console.log("WebGL context created successfully with options:", options);
        break;
      }
    } catch (e) {
      console.log(`Failed to create WebGL context with options ${i + 1}:`, options, e);
    }
  }

  console.log("Final WebGL context:", gl);
  
  if (!gl) {
    console.error("WebGL not supported or context creation failed");
    console.error("Browser WebGL support:", {
      webgl: !!canvas.getContext("webgl"),
      experimentalWebgl: !!canvas.getContext("experimental-webgl"),
      webgl2: !!canvas.getContext("webgl2")
    });
    
    // Try to get more detailed error information
    try {
      const testCanvas = document.createElement('canvas');
      const testGl = testCanvas.getContext('webgl');
      console.log("Test canvas WebGL support:", !!testGl);
    } catch (e) {
      console.error("Test canvas also failed:", e);
    }
    
    throw new Error("WebGL not supported");
  }

  console.log("Canvas size:", canvas.width, "x", canvas.height);

  // --- 2. Provide a minimal vertex shader -----------------------------------
  const vertexSrc = `
    attribute vec2 position;
    varying vec2 v_uv;
    varying vec2 fragCoord;
    
    void main() {
      v_uv = position * 0.5 + 0.5; // map -1..1 to 0..1
      // fragCoord should be in pixel coordinates (0 to width/height)
      fragCoord = (position * 0.5 + 0.5) * vec2(${canvas.width}.0, ${canvas.height}.0);
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // --- 3. Compile helpers ----------------------------------------------------
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(shader);
      console.error("Shader compile error:", msg);
      console.error("Source was:\n", source);
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
    -1, -1, // bottom-left
     1, -1, // bottom-right
    -1,  1, // top-left
     1,  1  // top-right
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
  const mouseLoc = gl.getUniformLocation(prog, "u_mouse");
  const start = performance.now();

  console.log("Uniform locations:", {
    time: timeLoc,
    resolution: resolutionLoc,
    mouse: mouseLoc
  });

  // Set resolution uniform
  if (resolutionLoc) {
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    console.log("Set resolution uniform:", canvas.width, canvas.height);
  }

  // Set mouse uniform (center of screen for now)
  if (mouseLoc) {
    gl.uniform2f(mouseLoc, canvas.width / 2, canvas.height / 2);
    console.log("Set mouse uniform:", canvas.width / 2, canvas.height / 2);
  }

  // --- 7. Render loop --------------------------------------------------------
  function draw() {
    // Update time uniform
    if (timeLoc) {
      const time = (performance.now() - start) / 1000;
      gl.uniform1f(timeLoc, time);
    }
    
    // Clear and draw
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestAnimationFrame(draw);
  }
  
  console.log("Starting render loop...");
  draw();
} 