import type { Camera, Object3D, Scene, WebGLRenderer } from 'three';

export async function precompile(renderer: WebGLRenderer, scenes: Scene[], camera: Camera) {
  for (const scene of scenes) {
    const states: [Object3D, boolean, boolean][] = [];
    scene.traverse(object => {
      states.push([object, object.visible, object.frustumCulled]);
      object.visible = true;
      object.frustumCulled = false;
    });
    try {
      await renderer.compileAsync(scene, camera);
    } finally {
      for (const [object, visible, culled] of states) {
        object.visible = visible;
        object.frustumCulled = culled;
      }
    }
  }
}
