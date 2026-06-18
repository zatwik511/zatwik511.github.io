import { useEffect, useRef } from 'react'

/**
 * The abstract hull line-art (corner brackets, edge ticks, side rails, circuit
 * traces, nodes and greeble squares). Returned as a fragment so it can be drawn
 * into two stacked <svg> layers (a dim base + a bright glow layer).
 *
 * Coords are percentages of the panel, so strokes stay crisp and circles round.
 */
function HullArt() {
  const sideY = Array.from({ length: 24 }, (_, i) => +(5 + i * 3.8).toFixed(1))
  const topEdge = [3, 6, 9, 12, 88, 91, 94, 97]
  const bottomEdge = Array.from({ length: 21 }, (_, i) => 6 + i * 4.4)
  const sideNodes = [18, 38, 58, 78]
  const sideSquares = [28, 50, 72]

  return (
    <>
      {/* top-edge ticks (corners only) */}
      {topEdge.map((x, i) => (
        <line key={`t${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2={i % 2 ? '2.8%' : '1.6%'} />
      ))}

      {/* bottom-edge tick strip */}
      {bottomEdge.map((x, i) => (
        <line
          key={`b${x}`}
          x1={`${x}%`}
          y1="100%"
          x2={`${x}%`}
          y2={i % 2 ? '96.6%' : '98.2%'}
        />
      ))}

      {/* full-height edge rails */}
      <line x1="1.3%" y1="3%" x2="1.3%" y2="97%" strokeDasharray="2 6" />
      <line x1="98.7%" y1="3%" x2="98.7%" y2="97%" strokeDasharray="2 6" />

      {/* side-margin ticks (both sides, alternating lengths) */}
      {sideY.map((y, i) => (
        <line key={`l${y}`} x1="0" y1={`${y}%`} x2={i % 2 ? '1.7%' : '2.6%'} y2={`${y}%`} />
      ))}
      {sideY.map((y, i) => (
        <line
          key={`r${y}`}
          x1={i % 2 ? '98.3%' : '97.4%'}
          y1={`${y}%`}
          x2="100%"
          y2={`${y}%`}
        />
      ))}

      {/* nodes on the side rails */}
      {sideNodes.map((y) => (
        <circle key={`ln${y}`} cx="1.3%" cy={`${y}%`} r="2" />
      ))}
      {sideNodes.map((y) => (
        <circle key={`rn${y}`} cx="98.7%" cy={`${y}%`} r="2" />
      ))}

      {/* tiny greeble squares in the margins */}
      {sideSquares.map((y) => (
        <rect key={`ls${y}`} x="0.4%" y={`${y}%`} width="6" height="6" />
      ))}
      {sideSquares.map((y) => (
        <rect key={`rs${y}`} x="98.4%" y={`${y}%`} width="6" height="6" />
      ))}

      {/* nested corner brackets */}
      {/* top-left */}
      <line x1="2%" y1="3%" x2="2%" y2="12%" />
      <line x1="2%" y1="3%" x2="9%" y2="3%" />
      <line x1="4.2%" y1="5.2%" x2="4.2%" y2="8.5%" />
      <line x1="4.2%" y1="5.2%" x2="7%" y2="5.2%" />
      {/* top-right */}
      <line x1="98%" y1="3%" x2="98%" y2="12%" />
      <line x1="98%" y1="3%" x2="91%" y2="3%" />
      <line x1="95.8%" y1="5.2%" x2="95.8%" y2="8.5%" />
      <line x1="95.8%" y1="5.2%" x2="93%" y2="5.2%" />
      {/* bottom-left */}
      <line x1="2%" y1="97%" x2="2%" y2="88%" />
      <line x1="2%" y1="97%" x2="9%" y2="97%" />
      <line x1="4.2%" y1="94.8%" x2="4.2%" y2="91.5%" />
      <line x1="4.2%" y1="94.8%" x2="7%" y2="94.8%" />
      {/* bottom-right */}
      <line x1="98%" y1="97%" x2="98%" y2="88%" />
      <line x1="98%" y1="97%" x2="91%" y2="97%" />
      <line x1="95.8%" y1="94.8%" x2="95.8%" y2="91.5%" />
      <line x1="95.8%" y1="94.8%" x2="93%" y2="94.8%" />

      {/* clusters in the pockets below the triangles (beside the tagline) */}
      {/* left */}
      <line x1="11%" y1="21.5%" x2="28%" y2="21.5%" />
      <line x1="28%" y1="21.5%" x2="32%" y2="25.5%" />
      <circle cx="32%" cy="25.5%" r="2.6" />
      <line x1="11%" y1="21.5%" x2="11%" y2="27%" />
      <circle cx="11%" cy="27%" r="1.8" />
      <line x1="14%" y1="24%" x2="20%" y2="24%" />
      <rect x="22%" y="19.5%" width="7" height="7" />
      {/* right (mirror) */}
      <line x1="89%" y1="21.5%" x2="72%" y2="21.5%" />
      <line x1="72%" y1="21.5%" x2="68%" y2="25.5%" />
      <circle cx="68%" cy="25.5%" r="2.6" />
      <line x1="89%" y1="21.5%" x2="89%" y2="27%" />
      <circle cx="89%" cy="27%" r="1.8" />
      <line x1="80%" y1="24%" x2="86%" y2="24%" />
      <rect x="71%" y="19.5%" width="7" height="7" />
    </>
  )
}

/**
 * Decorative hull line-art with a cursor "spotlight": a dim base layer is
 * always visible, and a bright glow layer is masked to a soft circle that
 * follows the cursor, so any thin line the cursor passes over (and the area
 * around it) flares bright white. Sits beneath the interactive content.
 */
export function HullDecor() {
  const glowRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = glowRef.current
    if (!el) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX
      const cy = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        const x = cx - r.left
        const y = cy - r.top
        const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height
        el.style.setProperty('--mx', inside ? `${x}px` : '-9999px')
        el.style.setProperty('--my', inside ? `${y}px` : '-9999px')
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <svg className="hull-decor hull-decor-base" aria-hidden="true">
        <HullArt />
      </svg>
      <svg ref={glowRef} className="hull-decor hull-decor-glow" aria-hidden="true">
        <HullArt />
      </svg>
    </>
  )
}
