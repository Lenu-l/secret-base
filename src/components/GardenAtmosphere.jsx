import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

/**
 * 🌿 Garden Atmosphere — dreamy floating motes, sparkles, and gentle color transitions.
 * Creates a soft, magical garden backdrop.
 */
export default function GardenAtmosphere() {
  const canvasRef = useRef(null)
  const { darkMode } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    // Color palettes for dreamy motes
    const COLORS_LIGHT = [
      { r: 131, g: 155, b: 131 },  // moss
      { r: 232, g: 180, b: 162 },  // peach
      { r: 184, g: 176, b: 208 },  // lavender
      { r: 247, g: 232, b: 208 },  // warm glow
      { r: 168, g: 191, b: 168 },  // soft green
      { r: 240, g: 200, b: 184 },  // soft pink
      { r: 200, g: 190, b: 175 },  // warm sand
    ]
    const COLORS_DARK = [
      { r: 107, g: 139, b: 107 },
      { r: 196, g: 139, b: 120 },
      { r: 107, g: 101, b: 128 },
      { r: 180, g: 160, b: 120 },
    ]
    const PALETTE = darkMode ? COLORS_DARK : COLORS_LIGHT

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    function initParticles() {
      const area = canvas.width * canvas.height
      const count = Math.min(Math.floor(area / 10000), 80)
      const palette = darkMode ? COLORS_DARK : COLORS_LIGHT

      particles = Array.from({ length: count }, () => {
        const color = palette[Math.floor(Math.random() * palette.length)]
        const isSparkle = Math.random() < 0.12
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          type: isSparkle ? 'sparkle' : (Math.random() < 0.18 ? 'petal' : 'mote'),
          size: isSparkle
            ? 0.8 + Math.random() * 1.8
            : 0.5 + Math.random() * 2.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: -0.06 - Math.random() * 0.3,
          opacity: 0.08 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
          swayAmp: 0.15 + Math.random() * 0.7,
          swayFreq: 0.002 + Math.random() * 0.008,
          color,
        }
      })
    }

    function drawSparkle(ctx, p, t) {
      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp
      const x = p.x + sway
      const alpha = p.opacity + Math.sin(t * 0.004 + p.phase) * 0.12
      const { r, g, b } = p.color

      // Draw as a tiny cross/star shape
      const s = p.size * 1.5
      ctx.save()
      ctx.globalAlpha = Math.max(0.04, Math.min(0.6, alpha * 2))
      ctx.strokeStyle = `rgba(${r},${g},${b},1)`
      ctx.lineWidth = 0.4
      ctx.beginPath()
      ctx.moveTo(x - s, p.y)
      ctx.lineTo(x + s, p.y)
      ctx.moveTo(x, p.y - s)
      ctx.lineTo(x, p.y + s)
      ctx.stroke()

      // Center glow dot
      const glow = ctx.createRadialGradient(x, p.y, 0, x, p.y, s * 0.6)
      glow.addColorStop(0, `rgba(${255},${255},${255},${Math.max(0.05, alpha)})`)
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, p.y, s * 0.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function drawPetal(ctx, p, t) {
      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp
      const x = p.x + sway
      const alpha = p.opacity + Math.sin(t * 0.003 + p.phase) * 0.06
      const { r, g, b } = p.color
      const s = p.size

      // Soft elliptical "petal" shape
      ctx.save()
      ctx.globalAlpha = Math.max(0.03, Math.min(0.35, alpha))
      ctx.fillStyle = `rgba(${r},${g},${b},1)`
      ctx.beginPath()
      ctx.ellipse(x, p.y, s * 1.8, s * 0.7, Math.sin(t * 0.001 + p.phase) * 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function drawMote(ctx, p, t) {
      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp
      const x = p.x + sway
      const alpha = p.opacity + Math.sin(t * 0.003 + p.phase) * 0.06
      const { r, g, b } = p.color

      const gradient = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.size * 2.5)
      gradient.addColorStop(0, `rgba(${r},${g},${b},${Math.max(0.03, alpha)})`)
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`)

      ctx.beginPath()
      ctx.arc(x, p.y, p.size * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = Date.now() / 1000

      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX

        if (p.y < -40) { p.y = canvas.height + 40; p.x = Math.random() * canvas.width }
        if (p.y > canvas.height + 40) { p.y = -40; p.x = Math.random() * canvas.width }
        if (p.x < -40) p.x = canvas.width + 40
        if (p.x > canvas.width + 40) p.x = -40

        if (p.type === 'sparkle') drawSparkle(ctx, p, t)
        else if (p.type === 'petal') drawPetal(ctx, p, t)
        else drawMote(ctx, p, t)
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [darkMode])

  return (
    <canvas
      ref={canvasRef}
      className="garden-atmosphere"
      aria-hidden="true"
    />
  )
}
