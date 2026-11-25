import { reactive } from 'vue';

/** Shared with the intro's ScrollTrigger; read by the existing render loop. */
export const introScroll = { progress: 0, active: false };

/** Reactive hologram scan progress (0..100) for the About pedestal display board. */
export const scanProgress = reactive({ percent: 0 });

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function introTransition(progress: number) {
  return {
    room: smooth((progress - 0.04) / 0.24),
    portrait: smooth((progress - 0.22) / 0.14),
    hologram: smooth((progress - 0.46) / 0.25),
  };
}
