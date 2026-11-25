import {
  DirectionalLight, HemisphereLight, MeshStandardMaterial, PCFSoftShadowMap, Box3, Color, Group, Material, Mesh, MeshBasicMaterial, Object3D, OrthographicCamera,
  PerspectiveCamera, PlaneGeometry, Raycaster, Scene, SkinnedMesh, Vector2, Vector3, WebGLRenderer,
  WebGLRenderTarget, SRGBColorSpace, NoToneMapping, ShaderMaterial,
} from 'three';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { WorkspaceAnimation, type WorkspaceClip } from './workspace-animation';
import { Resources } from './resources';
import { WorkspaceScreens } from './workspace-screens';
import { introScroll, introTransition, scanProgress, smooth } from './scroll-story';
import { clay, createMatcap, grid, hologram, woodFloor, grayWall } from './materials';
import { precompile } from './compile';

type Kind = 'workspace' | 'about' | 'contact';
interface Stage {
  element: HTMLElement; kind: Kind; scene: Scene; camera: PerspectiveCamera; width: number;
  animation?: WorkspaceAnimation; model: Group; height: number; distance: number; pointer: Vector2;
  screens?: WorkspaceScreens;
  origin: Vector3;
}

export class Experience {
  private renderer: WebGLRenderer;
  private resources = new Resources();
  private stages: Stage[] = [];
  private matcap = createMatcap();
  private shadowLights: DirectionalLight[] = [];
  private holoMaterials: ShaderMaterial[] = [];
  private grids: ShaderMaterial[] = [];
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
  private lastTick = 0;
  private notify: (message: string) => void;

  constructor(canvas: HTMLCanvasElement, notify: (message: string) => void) {
    this.notify = notify;
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
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

  async init(progress: (value: number, items?: Record<string, number>) => void) {
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
          const matName = (original.name || '').toLowerCase();
          const objName = (object.name || '').toLowerCase();
          const isWall = matName.includes('wall') || objName.includes('wall');
          const isFloor = matName.includes('floor');
          const next = resource === loaded.workspace
            ? isFloor ? woodFloor() : isWall ? grayWall() : new MeshStandardMaterial({ color, roughness: 0.85, metalness: 0 })
            : clay(color, this.matcap);
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
      const model = cloneSkeleton(source) as Group;
      if (kind !== 'workspace') {
        const charBounds = new Box3().setFromObject(model);
        const pedestal = cloneSkeleton(loaded.pedestal.scene) as Group;
        pedestal.position.y = charBounds.min.y;
        model.add(pedestal);
      }
      let bounds = new Box3().setFromObject(model);
      if (kind === 'workspace') {
        const deskBox = new Box3();
        model.traverse(obj => {
          if (obj instanceof Mesh && !obj.name.toLowerCase().includes('wall') && !obj.name.toLowerCase().includes('plinth')) {
            deskBox.expandByObject(obj);
          }
        });
        if (!deskBox.isEmpty()) bounds = deskBox;
      }
      const center = bounds.getCenter(new Vector3());
      const size = bounds.getSize(new Vector3());
      model.position.sub(center);
      if (kind === 'about') {
        const cache = new Map<Material, ShaderMaterial>();
        model.traverse(object => {
          if (!(object instanceof Mesh)) return;
          const convert = (original: Material) => {
            if (!cache.has(original)) {
              const color = 'color' in original ? original.color as Color : new Color('#d8b98e');
              const material = hologram(color, this.matcap, size.y);
              cache.set(original, material);
              this.holoMaterials.push(material);
              this.materials.add(material);
            }
            return cache.get(original)!;
          };
          object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material);
        });
      }
      const scene = new Scene();
      scene.add(model);
      if (kind === 'workspace') {
        // Soft fill keeps the reference palette bright under the overhead light.
        scene.add(new HemisphereLight(0xfff5e6, 0xc8c2b8, 1.8));
        const overhead = new DirectionalLight(0xfff4e4, 2.2);
        const span = Math.max(size.x, size.y, size.z);
        overhead.position.set(-span * 0.15, span * 2, span * 0.2);
        overhead.target.position.set(0, -size.y * 0.25, 0);
        overhead.castShadow = true;
        overhead.shadow.mapSize.set(2048, 2048);
        overhead.shadow.camera.left = -span;
        overhead.shadow.camera.right = span;
        overhead.shadow.camera.top = span;
        overhead.shadow.camera.bottom = -span;
        overhead.shadow.camera.near = 0.1;
        overhead.shadow.camera.far = span * 5;
        overhead.shadow.bias = -0.00015;
        overhead.shadow.normalBias = 0.012;
        overhead.shadow.camera.updateProjectionMatrix();
        model.traverse(object => {
          if (!(object instanceof Mesh)) return;
          // Walls receive shadows without blocking the room's overhead light.
          object.castShadow = !object.name.toLowerCase().includes('wall');
          object.receiveShadow = true;
        });
        scene.add(overhead, overhead.target);
        this.shadowLights.push(overhead);
      }
      const floorMaterial = grid();
      this.grids.push(floorMaterial);
      const floor = new Mesh(new PlaneGeometry(size.x * 2.5 + 3, size.z * 2.5 + 3), floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -size.y / 2 - 0.015;
      if (kind === 'contact') scene.add(floor);
      const camera = new PerspectiveCamera(32, 1, 0.05, 100);
      const stageDistance = kind === 'workspace' ? Math.max(size.x, size.y, size.z) * 1.65 : Math.max(size.x, size.y, size.z) * 2.35;
      const stage: Stage = { element, kind, model, scene, camera, width: size.x, height: size.y, distance: stageDistance, pointer: new Vector2(), origin: model.position.clone() };
      if (kind === 'workspace') {
        stage.screens = new WorkspaceScreens(model, Math.min(8, this.renderer.capabilities.getMaxAnisotropy()));
        stage.animation = new WorkspaceAnimation(model, loaded.workspace.animations, this.reduced.matches);
        model.traverse(object => { if (object instanceof Mesh) object.frustumCulled = false; });
      }
      this.stages.push(stage);
      this.listen(element, 'pointermove', event => {
        const e = event as PointerEvent;
        const rect = element.getBoundingClientRect();
        stage.pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
      });
      this.listen(element, 'pointerleave', () => stage.pointer.set(0, 0));
      this.listen(element, 'click', event => {
        if (kind === 'about') return;
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
          if (target.name.toLowerCase().includes('monitor')) isMonitor = true;
          target = target.parent;
        }
        if (isMonitor) {
          document.getElementById('projects')?.scrollIntoView({ behavior: this.reduced.matches ? 'instant' : 'smooth' });
          this.notify('Mở những dự án của Đạt.');
        } else {
          if (kind === 'workspace') stage.animation?.play('wave');
          else this.pulse = performance.now();
          this.notify(kind === 'contact' ? 'Deki thức rồi! Cùng trò chuyện nhé.' : 'Xin chào! Mình là Deki.');
        }
      });
    }
    this.listen(window, 'deki:animation', event => {
      const clip = (event as CustomEvent<WorkspaceClip>).detail;
      if (clip === 'wave' || clip === 'typing') this.playWorkspace(clip);
    });
    await Promise.all(this.stages.map(stage => stage.screens?.ready));
    if (this.disposed) return;
    progress(82);
    this.resize();
    const camera = this.stages[0]?.camera;
    if (camera) await precompile(this.renderer, [...this.stages.map(stage => stage.scene), this.composite], camera);
    if (this.disposed) return;
    // Warm the actual offscreen pass before dismissing the loader.
    this.renderer.setRenderTarget(this.target);
    this.renderer.clear();
    const about = this.stages.find(stage => stage.kind === 'about');
    if (about) this.renderer.render(about.scene, about.camera);
    this.renderer.setRenderTarget(null);
    progress(100);
    this.listen(window, 'resize', () => this.resize());
    this.tick();
  }

  playWorkspace(clip: WorkspaceClip) {
    this.stages.find(stage => stage.kind === 'workspace')?.animation?.play(clip);
  }

  private resize() {
    this.renderer.setSize(document.documentElement.clientWidth, window.innerHeight, false);
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    const now = performance.now();
    const delta = this.lastTick ? Math.min((now - this.lastTick) / 1000, 0.1) : 0;
    this.lastTick = now;
    if (this.hidden) return;
    const time = this.reduced.matches ? 0 : performance.now() / 1000;
    const story = introScroll.active && !this.reduced.matches;
    const transition = introTransition(introScroll.progress);
    const holoRatio = story ? transition.hologram : 1;
    const nextPercent = Math.round(holoRatio * 100);
    if (scanProgress.percent !== nextPercent) scanProgress.percent = nextPercent;
    for (const material of this.holoMaterials) {
      material.uniforms.uTime!.value = time;
      material.uniforms.uProgress!.value = holoRatio;
    }
    for (const material of this.grids) material.uniforms.uTime!.value = time;
    this.renderer.setScissorTest(false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clear();
    for (const stage of this.stages) {
      const rect = stage.element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= innerHeight || rect.width === 0 || rect.height === 0) continue;
      stage.animation?.update(delta, this.reduced.matches);
      const { camera, model, kind } = stage;
      if (story && kind === 'workspace' && transition.room >= 1) continue;
      if (story && kind === 'about' && transition.portrait <= 0) continue;
      model.position.copy(stage.origin);
      model.scale.setScalar(1);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      const fit = Math.max(1, 1 / camera.aspect);
      // A portrait viewport needs a gentler fit than 1 / aspect.
      const halfFov = Math.tan(camera.fov * Math.PI / 360);
      const distance = kind === 'about'
        ? Math.max(stage.height / (2 * halfFov), stage.width / (2 * halfFov * camera.aspect)) * 1.04
        : stage.distance * (kind === 'workspace' ? Math.sqrt(fit) : fit);
      const sectionProgress = Math.max(-1, Math.min(1, (innerHeight * 0.5 - rect.top - rect.height * 0.5) / innerHeight));
      const parallax = this.reduced.matches ? 0 : stage.pointer.x * 0.045 + sectionProgress * 0.12;
      // The greeting faces -X/+Z in glTF (confirmed from the shoulder bones).
      const angle = kind === 'about' ? Math.PI : kind === 'workspace' ? -Math.PI / 4 + (story ? transition.room * 0.32 : 0) : 2.92 + parallax;
      const heightRatio = kind === 'about' ? 0 : kind === 'workspace' ? 0.16 : 0.15;
      camera.position.set(Math.sin(angle) * distance, distance * heightRatio + (this.reduced.matches || kind !== 'contact' ? 0 : stage.pointer.y * 0.08), Math.cos(angle) * distance);
      camera.lookAt(0, kind === 'workspace' ? -stage.height * 0.04 : 0, 0);
      const bounce = this.pulse ? Math.max(0, 1 - (performance.now() - this.pulse) / 1100) : 0;
      model.rotation.y = this.reduced.matches || kind === 'about' ? 0 : Math.sin(time * 1.1) * (kind === 'contact' ? 0.04 : 0) + Math.sin(bounce * Math.PI * 4) * bounce * 0.10;
      if (story && kind === 'workspace') {
        model.scale.setScalar(1 - transition.room * 0.32);
        model.position.copy(stage.origin).multiplyScalar(model.scale.x);
        model.position.y += transition.room * stage.height * 0.9;
        model.rotation.y += transition.room * 0.18;
      }
      if (story && kind === 'about') {
        model.scale.setScalar(0.9 + transition.portrait * 0.1);
        // Scale around the centered model, rather than its exported origin.
        model.position.copy(stage.origin).multiplyScalar(model.scale.x);
        model.position.y -= (1 - transition.portrait) * stage.height * 0.08;
      }
      if (!this.reduced.matches && kind === 'contact') {
        const entrance = smooth((innerHeight - rect.top) / (innerHeight * 0.7));
        model.position.y -= (1 - entrance) * stage.height * 0.3;
        model.rotation.y += (1 - entrance) * 0.4;
      }
      const fadingRoom = story && kind === 'workspace' && transition.room > 0;
      if (fadingRoom) {
        const width = Math.min(1024, Math.round(rect.width * this.renderer.getPixelRatio()));
        const height = Math.min(1024, Math.round(rect.height * this.renderer.getPixelRatio()));
        if (this.target.width !== width || this.target.height !== height) this.target.setSize(width, height);
        this.renderer.setRenderTarget(this.target);
        this.renderer.setScissorTest(false);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.clear();
        this.renderer.render(stage.scene, camera);
        this.renderer.setRenderTarget(null);
        this.renderer.setViewport(rect.left, innerHeight - rect.bottom, rect.width, rect.height);
        this.renderer.setScissor(rect.left, Math.max(0, innerHeight - rect.bottom), rect.width, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top));
        this.renderer.setScissorTest(true);
        // Fade the workspace into the centered portrait's backdrop.
        const overlay = (this.composite.children[0] as Mesh).material as MeshBasicMaterial;
        overlay.opacity = 1 - smooth((transition.room - 0.15) / 0.85);
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
      if (object instanceof SkinnedMesh) object.skeleton.dispose();
      object.geometry.dispose();
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose();
    });
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const cleanup of this.listeners) cleanup();
    for (const stage of this.stages) {
      stage.animation?.dispose();
      stage.screens?.dispose();
      this.disposeTree(stage.scene);
    }
    this.disposeTree(this.composite);
    for (const material of this.materials) material.dispose();
    for (const material of this.grids) material.dispose();
    this.matcap.dispose();
    for (const light of this.shadowLights) light.shadow.dispose();
    this.target.dispose();
    this.renderer.dispose();
  }
}
