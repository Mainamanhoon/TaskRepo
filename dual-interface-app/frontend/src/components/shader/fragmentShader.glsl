uniform float u_time;
uniform vec3 u_color;
varying vec2 vUv;

void main() {
  // Create a pulsing color effect based on time and vertical position
  float strength = 0.5 + 0.5 * sin(u_time * 2.0 + vUv.y * 10.0);
  gl_FragColor = vec4(u_color * strength, 1.0);
}