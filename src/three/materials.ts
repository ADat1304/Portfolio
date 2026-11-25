import { CanvasTexture, Color, MeshStandardMaterial, MeshMatcapMaterial, SRGBColorSpace, ShaderMaterial, DoubleSide } from 'three';
import hologramVertex from './shaders/hologram.vert.glsl?raw';
import hologramFragment from './shaders/hologram.frag.glsl?raw';
import gridVertex from './shaders/grid.vert.glsl?raw';
import gridFragment from './shaders/grid.frag.glsl?raw';

// A shared studio matcap. No runtime lights or shadow maps are required.
export function createMatcap(softFill = false) {
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
    const value = Math.min(1, (softFill ? 0.64 : 0.30) + light * (softFill ? 0.34 : 0.68) + rim);
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

export function hologram(color: Color, matcap: CanvasTexture, height: number) {
  return new ShaderMaterial({
    vertexShader: hologramVertex, fragmentShader: hologramFragment,
    uniforms: {
      uTime: { value: 0 }, uProgress: { value: 0 },
      uMinY: { value: -height / 2 }, uHeight: { value: height },
      uBaseColor: { value: color.clone() }, uMatcap: { value: matcap },
    },
    transparent: true, side: DoubleSide,
  });
}

export function grid() {
  return new ShaderMaterial({
    vertexShader: gridVertex, fragmentShader: gridFragment,
    uniforms: { uTime: { value: 0 } }, transparent: true, depthWrite: false,
  });
}

/** Procedural wood uses world coordinates so the room floor needs no UV unwrap. */
export function woodFloor(color: Color) {
  const material = new MeshStandardMaterial({ color, roughness: 0.9, metalness: 0 });
  material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace('#include <common>',
      '#include <common>\nvarying vec3 vWoodPosition;');
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nvWoodPosition = (modelMatrix * vec4(position, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>',
      '#include <common>\nvarying vec3 vWoodPosition;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec2 wood = vWoodPosition.xz;
      float row = floor(wood.y / 0.22);
      float seed = fract(sin(row * 127.1) * 43758.5453);
      float along = wood.x + seed * 1.2;
      vec2 plank = vec2(fract(along / 1.2), fract(wood.y / 0.22));
      vec2 edge = min(plank, 1.0 - plank);
      vec2 aa = max(fwidth(plank), vec2(0.001));
      float seam = smoothstep(0.002, 0.002 + aa.x, edge.x)
        * smoothstep(0.009, 0.009 + aa.y, edge.y);
      float grain = sin(wood.y * 370.0 + 3.0 * sin(along * 5.0) + seed * 20.0);
      float fine = sin(wood.y * 850.0 + sin(along * 11.0));
      float timber = 0.87 + seed * 0.2 + grain * 0.075 + fine * 0.025;
      diffuseColor.rgb *= mix(timber * 0.48, timber, seam);
    `);
  };
  material.customProgramCacheKey = () => 'wood-floor-v1';
  return material;
}

/** Seamless plaster in world space, including walls without texture UVs. */
export function grayWall(color: Color) {
  const material = new MeshStandardMaterial({ color, roughness: 1, metalness: 0 });
  material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace('#include <common>',
      '#include <common>\nvarying vec3 vWallPosition;');
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nvWallPosition = (modelMatrix * vec4(position, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
      #include <common>
      varying vec3 vWallPosition;
      float plasterHash(vec3 p) {
        p = fract(p * 0.1031);
        p += dot(p, p.yzx + 33.33);
        return fract((p.x + p.y) * p.z);
      }
      float plasterNoise(vec3 p) {
        vec3 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(plasterHash(i), plasterHash(i + vec3(1,0,0)), f.x),
              mix(plasterHash(i + vec3(0,1,0)), plasterHash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(plasterHash(i + vec3(0,0,1)), plasterHash(i + vec3(1,0,1)), f.x),
              mix(plasterHash(i + vec3(0,1,1)), plasterHash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      float cloud = plasterNoise(vWallPosition * 3.5) - 0.5;
      float plaster = plasterNoise(vWallPosition * 45.0) - 0.5;
      float grain = plasterNoise(vWallPosition * 180.0) - 0.5;
      // Fade subpixel grain to avoid shimmering when the camera is distant.
      float footprint = length(fwidth(vWallPosition));
      float grainFade = 1.0 - smoothstep(0.003, 0.012, footprint);
      diffuseColor.rgb *= 1.0 + cloud * 0.14 + plaster * 0.12 + grain * 0.16 * grainFade;
    `);
  };
  material.customProgramCacheKey = () => 'gray-plaster-v1';
  return material;
}
