const base = import.meta.env.BASE_URL;
export const sources = {
  workspace: `${base}models/workspace.glb`,
  deki: `${base}models/deki.glb`,
} as const;
