import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { sources } from './sources';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class Resources {
  private loader = new GLTFLoader();
  private draco = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  private pending?: Promise<Record<keyof typeof sources, GLTF>>;

  constructor() { this.loader.setDRACOLoader(this.draco); }

  load(progress: (value: number, items?: Record<string, number>) => void) {
    if (this.pending) return this.pending;
    const entries = Object.entries(sources);
    const itemProgress: Record<string, number> = Object.fromEntries(entries.map(([name]) => [name, 0]));
    const report = () => {
      const avg = Object.values(itemProgress).reduce((sum, v) => sum + v, 0) / entries.length;
      progress(avg * 0.75, { ...itemProgress });
    };
    report();
    this.pending = Promise.all(entries.map(async ([name, url]) => {
      const model = await new Promise<GLTF>((resolve, reject) => {
        this.loader.load(
          url,
          gltf => {
            itemProgress[name] = 100;
            report();
            resolve(gltf);
          },
          event => {
            if (event.lengthComputable && event.total > 0) {
              itemProgress[name] = Math.min(99, Math.round((event.loaded / event.total) * 100));
              report();
            }
          },
          reject
        );
      });
      return [name, model] as const;
    })).then(loaded => Object.fromEntries(loaded) as Record<keyof typeof sources, GLTF>).finally(() => this.draco.dispose());
    return this.pending;
  }
}
