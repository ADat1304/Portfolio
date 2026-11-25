#include <common>
#include <skinning_pars_vertex>

varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;

void main() {
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>

  #include <begin_vertex>
  #include <skinning_vertex>

  vec4 world = modelMatrix * vec4(transformed, 1.0);
  vec4 view = viewMatrix * world;
  vNormal = normalize(transformedNormal);
  vView = -view.xyz;
  vWorld = world.xyz;
  gl_Position = projectionMatrix * view;
}
