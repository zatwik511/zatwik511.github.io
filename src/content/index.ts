export * from './types'
export { skillUrl } from './skills'
export { site } from './site'

import { site } from './site'
import { loadGroups } from './loader'
import type { Entry, Profile } from './types'

/**
 * The full profile the UI renders: site identity (site.ts) stitched together
 * with the per-page content discovered in the `pages/` folders (loader.ts).
 * Add a page = add a folder; no code change needed.
 */
export const profile: Profile = {
  ...site,
  groups: loadGroups(),
}

/** Flat list of every openable entry, in cockpit order. */
export const allEntries: Entry[] = profile.groups.flatMap((g) => g.entries)

/** Look up a single entry by id (used by deep links and the 3D scene graph). */
export function getEntry(id: string): Entry | undefined {
  return allEntries.find((e) => e.id === id)
}
