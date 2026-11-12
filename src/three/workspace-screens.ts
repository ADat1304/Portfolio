import { Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, Vector3, type Object3D } from 'three';

const screenImages = [
  `${import.meta.env.BASE_URL}textures/workspace/editor-v1.png`,
  `${import.meta.env.BASE_URL}textures/workspace/portfolio-v1.png`,
] as const;

/** Independent screen planes avoid stretching the box UVs of the exported glass. */
export class WorkspaceScreens {
  readonly ready: Promise<void[]>;
  private screens: Mesh<PlaneGeometry, MeshBasicMaterial>[] = [];
  private disposed = false;

  constructor(model: Object3D, anisotropy = 1) {
    const displays: Mesh[] = [];
    model.traverse(object => {
      if (object instanceof Mesh && (object.name.startsWith('Glass_display') || object.name.startsWith('Glass display'))) {
        displays.push(object);
      }
    });
    displays.sort((a, b) => {
      a.geometry.computeBoundingBox();
      b.geometry.computeBoundingBox();
      return a.geometry.boundingBox!.min.x - b.geometry.boundingBox!.min.x;
    });

    const loader = new TextureLoader();
    this.ready = Promise.all(displays.map((display, index) => {
      display.geometry.computeBoundingBox();
      const box = display.geometry.boundingBox!;
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());
      const material = new MeshBasicMaterial({ color: '#101725', toneMapped: false });
      const mesh = new Mesh(new PlaneGeometry(size.x * 0.98, size.y * 0.97), material);
      mesh.name = 'Monitor content';
      mesh.position.set(center.x, center.y, box.max.z + 0.001);
      display.add(mesh);
      this.screens.push(mesh);

      return loader.loadAsync(screenImages[index === 0 ? 0 : 1]).then(texture => {
        // Loading can finish after the experience has been unmounted.
        if (this.disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = anisotropy;
        material.color.set(0xffffff);
        material.map = texture;
        material.needsUpdate = true;
      });
    }));
  }

  dispose() {
    this.disposed = true;
    for (const mesh of this.screens) {
      mesh.removeFromParent();
      mesh.geometry.dispose();
      mesh.material.map?.dispose();
      mesh.material.dispose();
    }
    this.screens = [];
  }
}
