/**
 * Entry point into the 3D ride (mode `x`). Wiring to the actual ride lands in
 * Phase 3; for now it's a visible, accessible, pulsing affordance.
 */
export function LaunchButton({ onLaunch }: { onLaunch?: () => void }) {
  return (
    <button
      className="launch"
      type="button"
      onClick={onLaunch}
      aria-label="Launch the 3D ride"
    >
      ▲ LAUNCH 3D ↗
    </button>
  )
}
