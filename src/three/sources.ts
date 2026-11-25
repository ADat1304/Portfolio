const base = import.meta.env.BASE_URL;
export const sources = {
  workspace: `${base}models/workspace-animated.glb?v=seat-fit-2`,
  deki: `${base}models/deki.glb?v=breathing-idle-1`,
  pedestal: `${base}models/pedestal.glb?v=flush-display-2`,
} as const;
