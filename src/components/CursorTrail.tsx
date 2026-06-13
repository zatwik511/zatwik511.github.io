import { useEffect, useRef } from 'react'

interface TrailPoint {
  x: number
  y: number
  /** 1 → 0; the dot fades and shrinks as it dies. */
  life: number
  color: string
}

const RED = '#cf2424'
const WHITE = '#ffffff'

/**
 * A comet-style trail that follows the cursor's red dot. Particles are tinted
 * by region — red over the windshield, black over the cockpit — matching the
 * region-aware native cursor. Disabled under prefers-reduced-motion.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const points: TrailPoint[] = []
    let raf = 0
    let running = false

    // White over the cockpit panel, red elsewhere (windshield).
    const colorAt = (x: number, y: number): string => {
      const el = document.querySelector('.cockpit')
      if (el) {
        const r = el.getBoundingClientRect()
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          return WHITE
        }
      }
      return RED
    }

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const p of points) p.life -= 0.045
      while (points.length && points[0].life <= 0) points.shift()

      // Draw one continuous, tapering line through the points. Each segment
      // is stroked with its own colour so the trail recolours across regions.
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        const life = Math.max(b.life, 0)
        const t = i / (points.length - 1) // 0 at the tail → 1 at the head
        ctx.globalAlpha = life * 0.85
        ctx.strokeStyle = b.color
        ctx.shadowBlur = 8
        ctx.shadowColor = b.color
        ctx.lineWidth = 1 + t * 6
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      if (points.length) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const onMove = (e: MouseEvent) => {
      points.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        color: colorAt(e.clientX, e.clientY),
      })
      if (points.length > 60) points.shift()
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
}
