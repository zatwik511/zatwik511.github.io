import { useMemo } from 'react'

/** A painted (flat, non-rendered) starfield for the windshield background. */
export function Starfield({ count = 70 }: { count?: number }) {
  // Deterministic pseudo-random layout so the field is stable across renders
  // and SSR-safe. A small LCG keyed off the index.
  const stars = useMemo(() => {
    let seed = 1337
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    return Array.from({ length: count }, () => ({
      cx: +(rand() * 400).toFixed(1),
      cy: +(rand() * 470).toFixed(1),
      r: +(0.6 + rand() * 1.1).toFixed(2),
      o: +(0.4 + rand() * 0.6).toFixed(2),
    }))
  }, [count])

  return (
    <svg
      className="stars"
      width="100%"
      height="100%"
      viewBox="0 0 400 470"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.o} />
      ))}
    </svg>
  )
}
