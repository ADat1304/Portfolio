import { CanvasTexture, Color, MeshMatcapMaterial, SRGBColorSpace, ShaderMaterial, AdditiveBlending, DoubleSide } from 'three';
import hologramVertex from './shaders/hologram.vert.glsl?raw';
import hologramFragment from './shaders/hologram.frag.glsl?raw';
import gridVertex from './shaders/grid.vert.glsl?raw';
import gridFragment from './shaders/grid.frag.glsl?raw';

// A shared studio matcap. No runtime lights or shadow maps are required.
export function createMatcap() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const nx = (x - 127.5) / 128;
    const ny = (127.5 - y) / 128;
    const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    const light = Math.max(0, -nx * 0.38 + ny * 0.62 + nz * 0.68);
    const rim = Math.pow(1 - nz, 3) * 0.15;
    const value = Math.min(1, 0.30 + light * 0.68 + rim);
    const i = (y * 256 + x) * 4;
    image.data[i] = value * 255;
    image.data[i + 1] = value * 249;
    image.data[i + 2] = value * 237;
    image.data[i + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function clay(color: Color, matcap: CanvasTexture) {
  return new MeshMatcapMaterial({ color, matcap });
}

export function hologram() {
  return new ShaderMaterial({
    vertexShader: hologramVertex, fragmentShader: hologramFragment,
    uniforms: { uTime: { value: 0 } }, transparent: true,
    blending: AdditiveBlending, depthWrite: false, side: DoubleSide,
  });
}

export function grid() {
  return new ShaderMaterial({
    vertexShader: gridVertex, fragmentShader: gridFragment,
    uniforms: { uTime: { value: 0 } }, transparent: true, depthWrite: false,
  });
}
