import {
  Box3, Color, Group, Material, Mesh, MeshBasicMaterial, Object3D, OrthographicCamera,
  PerspectiveCamera, PlaneGeometry, Raycaster, Scene, Vector2, Vector3, WebGLRenderer,
  WebGLRenderTarget, SRGBColorSpace, NoToneMapping, ShaderMaterial,
} from 'three';
import { Resources } from './resources';
import { clay, createMatcap, grid, hologram } from './materials';
import { precompile } from './compile';

type Kind = 'workspace' | 'about' | 'contact';
interface Stage {
  element: HTMLElement; kind: Kind; scene: Scene; camera: PerspectiveCamera;
  model: Group; height: number; distance: number; pointer: Vector2;
}

export class Experience {
  private renderer: WebGLRenderer;
  private resources = new Resources();
  private stages: Stage[] = [];
  private matcap = createMatcap();
  private holoMaterial = hologram();
  private grids: ShaderMaterial[] = [];
  private holoScene = new Scene();
  private target = new WebGLRenderTarget(512, 512);
  private composite = new Scene();
  private compositeCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private materials = new Set<Material>();
  private raf = 0;
  private disposed = false;
  private hidden = document.hidden;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  private ray = new Raycaster();
  private listeners: (() => void)[] = [];
  private pulse = 0;
  holographic = true;
  private notify: (message: string) => void;

  constructor(canvas: HTMLCanvasElement, notify: (message: string) => void) {
    this.notify = notify;
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = NoToneMapping;
    this.renderer.autoClear = false;
    const overlay = new MeshBasicMaterial({ map: this.target.texture, transparent: true, depthTest: false, depthWrite: false });
    this.materials.add(overlay);
    this.composite.add(new Mesh(new PlaneGeometry(2, 2), overlay));
    this.listen(document, 'visibilitychange', () => { this.hidden = document.hidden; });
    this.listen(canvas, 'webglcontextlost', (event) => {
      event.preventDefault();
      this.notify('Kết nối đồ họa bị gián đoạn. Hãy tải lại trang để mở lại cảnh 3D.');
    });
  }

  private listen(target: EventTarget, event: string, callback: EventListener) {
    target.addEventListener(event, callback);
    this.listeners.push(() => target.removeEventListener(event, callback));
  }

  async init(progress: (value: number) => void) {
    const loaded = await this.resources.load(progress);
    if (this.disposed) {
      for (const resource of Object.values(loaded)) this.disposeTree(resource.scene);
      return;
    }
    const materialCache = new Map<Material, Material>();
    for (const resource of Object.values(loaded)) resource.scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const convert = (original: Material) => {
        if (!materialCache.has(original)) {
          const color = 'color' in original ? (original.color as Color) : new Color('#d8b98e');
          const next = clay(color, this.matcap);
          materialCache.set(original, next);
          this.materials.add(next);
          original.dispose();
        }
        return materialCache.get(original)!;
      };
      object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material);
    });
    for (const kind of ['workspace', 'about', 'contact'] as Kind[]) {
      const element = document.querySelector<HTMLElement>(`[data-scene="${kind}"]`);
      if (!element) continue;
      const source = kind === 'workspace' ? loaded.workspace.scene : loaded.deki.scene;
      const model = source.clone(true);
      const bounds = new Box3().setFromObject(model);
      const center = bounds.getCenter(new Vector3());
      const size = bounds.getSize(new Vector3());
      model.position.sub(center);
      const scene = new Scene();
      scene.add(model);
      const floorMaterial = grid();
      this.grids.push(floorMaterial);
      const floor = new Mesh(new PlaneGeometry(size.x * 2.5 + 3, size.z * 2.5 + 3), floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -size.y / 2 - 0.015;
      scene.add(floor);
      const camera = new PerspectiveCamera(32, 1, 0.05, 100);
      const stage: Stage = { element, kind, model, scene, camera, height: size.y, distance: Math.max(size.x, size.y, size.z) * 2.35, pointer: new Vector2() };
      this.stages.push(stage);
      if (kind === 'about') {
        const holoModel = model.clone(true);
        holoModel.traverse(object => { if (object instanceof Mesh) object.material = this.holoMaterial; });
        this.holoScene.add(holoModel);
      }
      this.listen(element, 'pointermove', event => {
        const e = event as PointerEvent;
        const rect = element.getBoundingClientRect();
        stage.pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
      });
      this.listen(element, 'pointerleave', () => stage.pointer.set(0, 0));
      this.listen(element, 'click', event => {
        const rect = element.getBoundingClientRect();
        const e = event as MouseEvent;
        const pointer = new Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
        camera.updateMatrixWorld();
        this.ray.setFromCamera(pointer, camera);
        const hit = this.ray.intersectObject(model, true)[0];
        if (!hit) return;
        let target: Object3D | null = hit.object;
        let isMonitor = false;
        while (target) {
          if (target.name.includes('monitor')) isMonitor = true;
          target = target.parent;
        }
        if (isMonitor) {
          document.getElementById('projects')?.scrollIntoView({ behavior: this.reduced.matches ? 'instant' : 'smooth' });
          this.notify('Mở những dự án của Đạt.');
        } else {
          this.pulse = performance.now();
          this.notify(kind === 'contact' ? 'Deki thức rồi! Cùng trò chuyện nhé.' : 'Xin chào! Mình là Deki.');
        }
      });
    }
    progress(82);
    this.resize();
    const camera = this.stages[0]?.camera;
    if (camera) await precompile(this.renderer, [...this.stages.map(stage => stage.scene), this.holoScene, this.composite], camera);
    if (this.disposed) return;
    // Warm the actual offscreen pass before dismissing the loader.
    this.renderer.setRenderTarget(this.target);
    this.renderer.clear();
    this.renderer.render(this.holoScene, camera!);
    this.renderer.setRenderTarget(null);
    progress(100);
    this.listen(window, 'resize', () => this.resize());
    this.tick();
  }

  private resize() {
    this.renderer.setSize(document.documentElement.clientWidth, window.innerHeight, false);
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    if (this.hidden) return;
    const time = this.reduced.matches ? 0 : performance.now() / 1000;
    this.holoMaterial.uniforms.uTime!.value = time;
    for (const material of this.grids) material.uniforms.uTime!.value = time;
    this.renderer.setScissorTest(false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clear();
    for (const stage of this.stages) {
      const rect = stage.element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= innerHeight || rect.width === 0 || rect.height === 0) continue;
      const { camera, model, kind } = stage;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      const fit = Math.max(1, 1 / camera.aspect);
      const distance = stage.distance * fit;
      const sectionProgress = Math.max(-1, Math.min(1, (innerHeight * 0.5 - rect.top - rect.height * 0.5) / innerHeight));
      const parallax = this.reduced.matches ? 0 : stage.pointer.x * 0.045 + sectionProgress * 0.12;
      // Blender's room camera looks from +X/-Y/+Z; glTF maps this to +X/+Y/+Z.
      const angle = kind === 'workspace' ? 0.78 + parallax : 2.92 + parallax;
      camera.position.set(Math.sin(angle) * distance, distance * (kind === 'workspace' ? 0.64 : 0.15) + (this.reduced.matches ? 0 : stage.pointer.y * 0.08), Math.cos(angle) * distance);
      camera.lookAt(0, kind === 'workspace' ? -stage.height * 0.06 : 0, 0);
      const bounce = this.pulse ? Math.max(0, 1 - (performance.now() - this.pulse) / 1100) : 0;
      model.rotation.y = this.reduced.matches ? 0 : Math.sin(time * 1.1) * (kind === 'contact' ? 0.04 : 0) + Math.sin(bounce * Math.PI * 4) * bounce * 0.10;
      if (kind === 'about' && this.holographic) {
        const width = Math.min(1024, Math.round(rect.width * this.renderer.getPixelRatio()));
        const height = Math.min(1024, Math.round(rect.height * this.renderer.getPixelRatio()));
        if (this.target.width !== width || this.target.height !== height) this.target.setSize(width, height);
        this.renderer.setRenderTarget(this.target);
        this.renderer.setScissorTest(false);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.clear();
        this.renderer.render(this.holoScene, camera);
        this.renderer.setRenderTarget(null);
        this.renderer.setViewport(rect.left, innerHeight - rect.bottom, rect.width, rect.height);
        this.renderer.setScissor(rect.left, Math.max(0, innerHeight - rect.bottom), rect.width, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top));
        this.renderer.setScissorTest(true);
        // Render the grid, then composite the isolated hologram target.
        model.visible = false;
        this.renderer.render(stage.scene, camera);
        model.visible = true;
        this.renderer.render(this.composite, this.compositeCamera);
      } else {
        this.renderer.setViewport(rect.left, innerHeight - rect.bottom, rect.width, rect.height);
        this.renderer.setScissor(rect.left, Math.max(0, innerHeight - rect.bottom), rect.width, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top));
        this.renderer.setScissorTest(true);
        this.renderer.render(stage.scene, camera);
      }
    }
  };

  private disposeTree(root: Object3D) {
    root.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.geometry.dispose();
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose();
    });
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const cleanup of this.listeners) cleanup();
    for (const stage of this.stages) this.disposeTree(stage.scene);
    this.disposeTree(this.holoScene);
    this.disposeTree(this.composite);
    for (const material of this.materials) material.dispose();
    for (const material of this.grids) material.dispose();
    this.holoMaterial.dispose();
    this.matcap.dispose();
    this.target.dispose();
    this.renderer.dispose();
  }
}
