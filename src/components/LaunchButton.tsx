/**
 * Entry point into the 3D ride (mode `x`). Wiring to the actual ride lands in
 * Phase 3; for now it's a visible, accessible, pulsing affordance — a white
 * up-triangle over a "Launch 3D" label, both turning red on hover.
 */
export function LaunchButton({ onLaunch }: { onLaunch?: () => void }) {
  return (
    <button
      className="launch"
      type="button"
      onClick={onLaunch}
      aria-label="Launch the 3D ride"
    >
      <svg className="launch-tri" viewBox="0 0 28 24" aria-hidden="true">
        <polygon points="14,2 26,22 2,22" />
      </svg>
      <span className="launch-label">Launch 3D</span>
    </button>
  )
}
