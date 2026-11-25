import {
  AnimationMixer, CanvasTexture, DirectionalLight, HemisphereLight, MeshStandardMaterial, PCFSoftShadowMap, Box3, Color, Group, Material, Mesh, MeshBasicMaterial, Object3D, OrthographicCamera,
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
  animation?: WorkspaceAnimation; mixer?: AnimationMixer; model: Group; height: number; distance: number; pointer: Vector2;
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
  private screenCanvas?: HTMLCanvasElement;
  private screenTexture?: CanvasTexture;
  private lastScreenPercent = -1;
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
    const stage_mixers = new Map<Group, AnimationMixer>();
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
            ? isFloor || objName.includes('plinth') ? woodFloor(color) : isWall ? grayWall(color) : new MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, side: original.side })
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
        const armature = model.getObjectByName('Armature');
        if (armature) armature.rotateZ(Math.PI);
        if (loaded.deki.animations.length > 0) {
          const mixer = new AnimationMixer(model);
          mixer.clipAction(loaded.deki.animations[0]!).play();
          mixer.update(0);
          stage_mixers.set(model, mixer);
        }
        // Raw glTF POSITION accessors are already in character Y-up space (-0.024 .. 2.208).
        const charBounds = new Box3();
        model.traverse(obj => {
          if (obj instanceof Mesh) {
            obj.geometry.computeBoundingBox();
            if (obj.geometry.boundingBox) charBounds.union(obj.geometry.boundingBox);
          }
        });
        const pedestal = cloneSkeleton(loaded.pedestal.scene) as Group;
        pedestal.position.y = charBounds.isEmpty() ? 0 : charBounds.min.y;
        model.add(pedestal);
      }
      let bounds = new Box3().setFromObject(model);
      if (kind !== 'workspace') {
        const trueBox = new Box3();
        model.updateMatrixWorld(true);
        model.traverse(obj => {
          if (obj instanceof Mesh) {
            obj.geometry.computeBoundingBox();
            if (obj.geometry.boundingBox) {
              const b = obj.geometry.boundingBox.clone();
              if (!(obj instanceof SkinnedMesh)) b.applyMatrix4(obj.matrixWorld);
              trueBox.union(b);
            }
          }
        });
        if (!trueBox.isEmpty()) bounds = trueBox;
      }
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
        const screenMaterial = this.getPedestalScreenMaterial();
        model.traverse(object => {
          if (!(object instanceof Mesh)) return;
          if (object.name.includes('SM_Pedestal_Screen')) {
            object.material = screenMaterial;
            return;
          }
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
      } else if (kind === 'contact') {
        const screenMaterial = this.getPedestalScreenMaterial();
        model.traverse(object => {
          if (object instanceof Mesh && object.name.includes('SM_Pedestal_Screen')) {
            object.material = screenMaterial;
          }
        });
      }
      const scene = new Scene();
      scene.add(model);
      if (kind === 'workspace') {
        scene.add(new HemisphereLight(0xf2efff, 0x827279, 0.95));
        const overhead = new DirectionalLight(0xffefd9, 1.65);
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
      } else if (stage_mixers.has(model)) {
        stage.mixer = stage_mixers.get(model);
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

  private getPedestalScreenMaterial() {
    if (!this.screenTexture) {
      this.screenCanvas = document.createElement('canvas');
      this.screenCanvas.width = 512;
      this.screenCanvas.height = 256;
      this.screenTexture = new CanvasTexture(this.screenCanvas);
      this.screenTexture.colorSpace = SRGBColorSpace;
      this.drawPedestalScreen(0);
    }
    const mat = new MeshBasicMaterial({ map: this.screenTexture });
    this.materials.add(mat);
    return mat;
  }

  private drawPedestalScreen(percent: number) {
    if (!this.screenCanvas || !this.screenTexture || this.lastScreenPercent === percent) return;
    this.lastScreenPercent = percent;
    const ctx = this.screenCanvas.getContext('2d')!;
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#071b29');
    grad.addColorStop(1, '#040e17');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(103, 217, 235, 0.06)';
    for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2);

    ctx.strokeStyle = 'rgba(103, 217, 235, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    const unlocked = Math.min(4, Math.floor(percent / 25));
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = percent >= 100 ? '#4ade80' : percent > 0 ? '#7dd3fc' : '#efab72';
    ctx.fillText(
      percent >= 100 ? '● INFO UNLOCKED [4/4]' : percent > 0 ? `● SCANNING DATA [${unlocked}/4]` : '● CLAY STANDBY [0/4]',
      w / 2,
      44
    );

    const digits = `${String(percent).padStart(3, '0')}%`;
    ctx.font = '800 104px "JetBrains Mono", monospace';
    ctx.shadowColor = 'rgba(103, 217, 235, 0.75)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#e6fcff';
    ctx.fillText(digits, w / 2, 154);
    ctx.shadowBlur = 0;

    const barX = 42;
    const barY = 192;
    const totalW = w - 84;
    const gap = 10;
    const segW = (totalW - gap * 3) / 4;
    const barH = 18;

    for (let i = 0; i < 4; i++) {
      const sx = barX + i * (segW + gap);
      ctx.fillStyle = 'rgba(103, 217, 235, 0.16)';
      ctx.fillRect(sx, barY, segW, barH);

      const segRatio = Math.max(0, Math.min(1, (percent - i * 25) / 25));
      if (segRatio > 0) {
        ctx.fillStyle = segRatio >= 1 ? '#4ade80' : '#38bdf8';
        ctx.fillRect(sx, barY, Math.round(segW * segRatio), barH);
      }
    }

    this.screenTexture.needsUpdate = true;
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
    this.drawPedestalScreen(nextPercent);
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
      if (!this.reduced.matches) stage.mixer?.update(delta);
      const { camera, model, kind } = stage;
      if (story && kind === 'workspace' && transition.room >= 1) continue;
      if (story && kind === 'about' && transition.portrait <= 0) continue;
      model.position.copy(stage.origin);
      model.scale.setScalar(kind === 'about' ? 0.9 : 1);
      if (kind === 'about') model.position.multiplyScalar(0.9);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      const fit = Math.max(1, 1 / camera.aspect);
      // A portrait viewport needs a gentler fit than 1 / aspect.
      const halfFov = Math.tan(camera.fov * Math.PI / 360);
      const distance = kind === 'about'
        ? Math.max(stage.height / (2 * halfFov), stage.width / (2 * halfFov * camera.aspect)) * 1.24
        : stage.distance * (kind === 'workspace' ? Math.sqrt(fit) : fit);
      const sectionProgress = Math.max(-1, Math.min(1, (innerHeight * 0.5 - rect.top - rect.height * 0.5) / innerHeight));
      const parallax = this.reduced.matches ? 0 : stage.pointer.x * 0.045 + sectionProgress * 0.12;
      // The greeting faces -X/+Z in glTF (confirmed from the shoulder bones).
      const angle = kind === 'about' ? Math.PI : kind === 'workspace' ? -Math.PI / 4 + (story ? transition.room * 0.32 : 0) : 2.92 + parallax;
      const heightRatio = kind === 'about' ? 0.17 : kind === 'workspace' ? 0.16 : 0.15;
      camera.position.set(Math.sin(angle) * distance, distance * heightRatio + (this.reduced.matches || kind !== 'contact' ? 0 : stage.pointer.y * 0.08), Math.cos(angle) * distance);
      camera.lookAt(0, kind === 'workspace' ? -stage.height * 0.04 : kind === 'about' ? -stage.height * 0.02 : 0, 0);
      const bounce = this.pulse ? Math.max(0, 1 - (performance.now() - this.pulse) / 1100) : 0;
      model.rotation.y = this.reduced.matches || kind === 'about' ? 0 : Math.sin(time * 1.1) * (kind === 'contact' ? 0.04 : 0) + Math.sin(bounce * Math.PI * 4) * bounce * 0.10;
      if (story && kind === 'workspace') {
        model.scale.setScalar(1 - transition.room * 0.32);
        model.position.copy(stage.origin).multiplyScalar(model.scale.x);
        model.position.y += transition.room * stage.height * 0.9;
        model.rotation.y += transition.room * 0.18;
      }
      if (story && kind === 'about') {
        model.scale.setScalar(0.81 + transition.portrait * 0.09);
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
      stage.mixer?.stopAllAction();
      stage.mixer?.uncacheRoot(stage.model);
      stage.screens?.dispose();
      this.disposeTree(stage.scene);
    }
    this.disposeTree(this.composite);
    for (const material of this.materials) material.dispose();
    for (const material of this.grids) material.dispose();
    this.screenTexture?.dispose();
    this.matcap.dispose();
    for (const light of this.shadowLights) light.shadow.dispose();
    this.target.dispose();
    this.renderer.dispose();
  }
}
