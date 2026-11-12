uniform float uTime;
uniform float uProgress;
uniform float uMinY;
uniform float uHeight;
uniform vec3 uBaseColor;
uniform sampler2D uMatcap;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;

void main() {
  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) normal *= -1.0;
  vec3 view = normalize(vView);
  vec3 x = normalize(vec3(view.z, 0.0, -view.x));
  vec3 y = cross(view, x);
  vec2 matcapUV = vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;
  vec3 clay = texture2D(uMatcap, matcapUV).rgb * uBaseColor;

  // A soft scan rises from the feet. Endpoints keep the entire body clay / hologram.
  float height = clamp((vWorld.y - uMinY) / max(uHeight, 0.001), 0.0, 1.0);
  float boundary = uProgress * 1.3 - 0.15;
  float converted = 1.0 - smoothstep(boundary - 0.055, boundary + 0.055, height);
  float scan = (1.0 - smoothstep(0.0, 0.024, abs(height - boundary)))
    * step(0.001, uProgress) * (1.0 - step(0.999, uProgress));

  float fresnel = pow(1.0 - abs(dot(normal, view)), 1.6);
  float lines = pow(0.5 + 0.5 * sin(vWorld.y * 115.0 - uTime * 3.0), 5.0);
  float sweep = pow(0.5 + 0.5 * sin(vWorld.y * 4.0 - uTime * 1.4), 16.0);
  vec3 hologram = vec3(0.16, 0.72, 0.86) * (0.55 + fresnel * 1.3 + lines * 0.45 + sweep * 0.3);
  vec3 color = mix(clay, hologram, converted) + vec3(0.42, 0.95, 1.0) * scan * 0.7;
  float alpha = mix(1.0, 0.3 + fresnel * 0.5 + lines * 0.16, converted);
  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
