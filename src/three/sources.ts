const base = import.meta.env.BASE_URL;
export const sources = {
  workspace: `${base}models/workspace-animated.glb?v=bright-character-1`,
  deki: `${base}models/deki.glb`,
  pedestal: `${base}models/pedestal.glb`,
} as const;
