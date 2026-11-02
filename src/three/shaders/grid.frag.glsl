varying vec2 vUv;
uniform float uTime;
void main() {
  vec2 p = vUv * 28.0;
  vec2 grid = abs(fract(p - 0.5) - 0.5) / max(fwidth(p), vec2(0.001));
  float line = 1.0 - min(min(grid.x, grid.y), 1.0);
  float radius = length(vUv - 0.5);
  float fade = 1.0 - smoothstep(0.12, 0.5, radius);
  float pulse = 0.7 + 0.3 * sin(uTime * 0.7 - radius * 20.0);
  gl_FragColor = vec4(0.35, 0.76, 0.77, line * fade * 0.22 * pulse);
}
