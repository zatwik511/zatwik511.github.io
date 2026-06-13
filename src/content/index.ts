export * from './types'
export { profile } from './profile'

import { profile } from './profile'
import type { Entry } from './types'

/** Flat list of every openable entry, in cockpit order. */
export const allEntries: Entry[] = profile.groups.flatMap((g) => g.entries)

/** Look up a single entry by id (used by deep links and the 3D scene graph). */
export function getEntry(id: string): Entry | undefined {
  return allEntries.find((e) => e.id === id)
}
