import {
  AnimationMixer, Box3, LoopOnce, LoopRepeat, Vector3,
  type AnimationAction, type AnimationClip, type Object3D,
} from 'three';

export type WorkspaceClip = 'wave' | 'typing';

/** Keep the mouse on the desk; only acquire the hand while it is over the mat. */
export class MouseFollower {
  private hand: Object3D | undefined;
  private mouse: Object3D | undefined;
  private bounds = new Box3();
  private home = new Vector3();
  private position = new Vector3();
  private handPosition = new Vector3();
  private offset = new Vector3();
  private target = new Vector3();
  private gripping = false;

  private root: Object3D;

  constructor(root: Object3D) {
    this.root = root;
    // GLTFLoader sanitizes ':' out of bone names.
    root.traverse(object => {
      if (object.name.replace(/[^a-z0-9]/gi, '') === 'mixamorigRightHand') this.hand = object;
      if (object.name === 'PROP_Mouse') this.mouse = object;
    });
    const mat = root.getObjectByName('Mouse_mat');
    if (!this.hand || !this.mouse || !mat) return;
    root.updateMatrixWorld(true);
    this.bounds.setFromObject(mat).applyMatrix4(root.matrixWorld.clone().invert());
    root.worldToLocal(this.mouse.getWorldPosition(this.home));
    this.position.copy(this.home);
  }

  reset() {
    this.position.copy(this.home);
    this.gripping = false;
  }

  update(enabled: boolean) {
    if (!this.hand || !this.mouse?.parent || this.bounds.isEmpty()) return;
    this.root.updateMatrixWorld(true);
    // Probe the palm, not the wrist: local +Y runs from wrist toward knuckles.
    this.handPosition.set(0, 0.065, 0);
    this.hand.localToWorld(this.handPosition);
    this.root.worldToLocal(this.handPosition);
    const hand = this.handPosition;
    const margin = 0.045;
    const overMat = hand.x >= this.bounds.min.x + margin && hand.x <= this.bounds.max.x - margin
      && hand.z >= this.bounds.min.z + margin && hand.z <= this.bounds.max.z - margin;
    const closeToDesk = hand.y >= this.home.y - 0.005 && hand.y <= this.home.y + 0.035;
    const nearMouse = Math.hypot(hand.x - this.position.x, hand.z - this.position.z) < 0.10;
    if (enabled && overMat && closeToDesk && (this.gripping || nearMouse)) {
      if (!this.gripping) this.offset.copy(this.position).sub(hand);
      this.gripping = true;
      this.position.x = Math.max(this.bounds.min.x + margin, Math.min(this.bounds.max.x - margin, hand.x + this.offset.x));
      this.position.z = Math.max(this.bounds.min.z + margin, Math.min(this.bounds.max.z - margin, hand.z + this.offset.z));
    } else {
      this.gripping = false;
    }
    // Override the mouse hold keys after mixer evaluation, in the bone parent's space.
    this.target.copy(this.position);
    this.root.localToWorld(this.target);
    this.mouse.parent.worldToLocal(this.target);
    this.mouse.position.copy(this.target);
    this.mouse.updateMatrixWorld(true);
  }
}

export class WorkspaceAnimation {
  private mixer: AnimationMixer;
  private actions: Record<WorkspaceClip, AnimationAction>;
  private current: WorkspaceClip = 'wave';
  private outgoing?: AnimationAction;
  private fadeRemaining = 0;
  private mouse: MouseFollower;
  private reduced = false;
  private staticPose = false;
  private readonly blendSeconds = 0.35;

  private root: Object3D;

  constructor(root: Object3D, clips: AnimationClip[], reducedMotion = false) {
    this.root = root;
    this.mixer = new AnimationMixer(root);
    const action = (name: WorkspaceClip) => {
      const clip = clips.find(clip => clip.name === name);
      if (!clip) throw new Error(`Workspace model is missing animation: ${name}`);
      return this.mixer.clipAction(clip);
    };
    this.actions = { wave: action('wave'), typing: action('typing') };
    this.actions.wave.setLoop(LoopOnce, 1);
    this.actions.wave.clampWhenFinished = true;
    this.actions.typing.setLoop(LoopRepeat, Infinity);
    // Measure mouse/mat in the normal working pose, not the 135-degree greeting pose.
    this.actions.typing.play();
    this.mixer.update(0);
    this.mouse = new MouseFollower(root);
    this.actions.typing.stop();
    this.reduced = reducedMotion;
    this.play(reducedMotion ? 'typing' : 'wave', 0);
    if (reducedMotion) this.staticPose = true;
  }

  get clip(): WorkspaceClip { return this.current; }

  play(name: WorkspaceClip, transition = this.blendSeconds) {
    if (this.reduced) {
      name = 'typing';
      transition = 0;
      this.staticPose = true;
    }
    const previous = this.actions[this.current];
    const next = this.actions[name];
    this.outgoing?.stop();
    this.outgoing = undefined;
    if (previous !== next && previous.isRunning() && transition > 0) {
      previous.stopFading().fadeOut(transition);
      this.outgoing = previous;
      this.fadeRemaining = transition;
    } else {
      previous.stop();
    }
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
    if (this.outgoing) next.fadeIn(transition);
    this.current = name;
    if (name === 'wave') this.mouse.reset();
    this.mixer.update(0);
  }

  update(delta: number, reducedMotion = this.reduced) {
    if (reducedMotion !== this.reduced) {
      this.reduced = reducedMotion;
      this.staticPose = reducedMotion;
      if (reducedMotion) this.play('typing', 0);
    }
    if (this.staticPose) return;
    const step = Math.max(0, Math.min(delta, 0.1));
    this.mixer.update(step);
    if (this.outgoing) {
      this.fadeRemaining -= step;
      if (this.fadeRemaining <= 0) {
        this.outgoing.stop();
        this.outgoing = undefined;
      }
    }
    if (this.current === 'wave' && this.actions.wave.time >= this.actions.wave.getClip().duration - this.blendSeconds) {
      this.play('typing');
    }
    this.mouse.update(this.current === 'typing' && !this.outgoing);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.root);
  }
}
