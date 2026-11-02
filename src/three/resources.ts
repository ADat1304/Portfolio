import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { sources } from './sources';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class Resources {
  private loader = new GLTFLoader();
  private draco = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  private pending?: Promise<Record<keyof typeof sources, GLTF>>;

  constructor() { this.loader.setDRACOLoader(this.draco); }

  load(progress: (value: number) => void) {
    if (this.pending) return this.pending;
    let complete = 0;
    this.pending = Promise.all(Object.entries(sources).map(async ([name, url]) => {
      const model = await this.loader.loadAsync(url);
      progress(++complete / Object.keys(sources).length * 75);
      return [name, model] as const;
    })).then(entries => Object.fromEntries(entries) as Record<keyof typeof sources, GLTF>).finally(() => this.draco.dispose());
    return this.pending;
  }
}
