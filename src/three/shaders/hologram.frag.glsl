uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;
void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.6);
  float lines = pow(0.5 + 0.5 * sin(vWorld.y * 115.0 - uTime * 3.0), 5.0);
  float sweep = pow(0.5 + 0.5 * sin(vWorld.y * 4.0 - uTime * 1.4), 16.0);
  gl_FragColor = vec4(vec3(0.26, 0.85, 0.94) * (0.5 + fresnel + sweep), 0.18 + fresnel * 0.55 + lines * 0.22);
}
