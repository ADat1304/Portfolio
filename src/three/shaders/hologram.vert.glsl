varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec4 view = viewMatrix * world;
  vNormal = normalize(normalMatrix * normal);
  vView = -view.xyz;
  vWorld = world.xyz;
  gl_Position = projectionMatrix * view;
}
